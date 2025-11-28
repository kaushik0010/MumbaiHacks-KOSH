"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { Bot, Send, Paperclip, Sparkles, AlertCircle, Info, Loader2, Mic, Volume2, X } from "lucide-react"; // Added 'X' icon
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AIHubProps {
  healthScore: number;
  walletBalance: number;
  taxBalance: number;
  savingsHistory: any[];
}

type ActionItem = {
  id: string;
  type: "critical" | "urgent" | "info" | "suggestion";
  text: string;
  action: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string; 
};

export default function AIHub({ healthScore, walletBalance, taxBalance, savingsHistory }: AIHubProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [actions, setActions] = useState<ActionItem[]>([]);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // New State for Preview
  const [isListening, setIsListening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, previewUrl]); // Scroll when preview appears too

  // Handle Image Preview URL generation/cleanup
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    // Cleanup memory when file changes or component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    axios.get("/api/ai/action-list").then((res) => {
      if (res.data.success) {
        setActions(res.data.actions);
      }
    });
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // --- UPDATED VOICE LOGIC ---
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/\p{Extended_Pictographic}/gu, '');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Speed Control: 1.0 is normal. 1.2 to 1.4 is snappy for an AI agent.
      utterance.rate = 1.3; 
      // Optional: Slightly lower pitch sounds more authoritative
      utterance.pitch = 1.0; 

      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      alert("Browser does not support speech recognition.");
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input && !selectedFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    let base64Image = "";
    if (selectedFile) {
      try {
        base64Image = await fileToBase64(selectedFile);
        userMessage.image = base64Image;
      } catch (err) {
        console.error("Image error", err);
      }
    }

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedFile(null); // Clear file
    setPreviewUrl(null);   // Clear preview
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        content: m.content
      }));

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history,
          message: userMessage.content,
          image: base64Image || null,
          data: { healthScore, walletBalance, taxBalance, savingsHistory }
        }),
      });

      if (!response.body) throw new Error("No response body");

      const assistantMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: assistantMsgId, role: "assistant", content: "" }
      ]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          accumulatedText += chunk;
          setMessages((prev) => 
            prev.map((msg) => 
              msg.id === assistantMsgId ? { ...msg, content: accumulatedText } : msg
            )
          );
        }
      }
      speakText(accumulatedText);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="fixed bottom-6 right-6 z-50 cursor-pointer group">
          <Button className="h-14 w-14 rounded-full shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all group-hover:scale-105">
            <Bot className="h-8 w-8 text-white" />
          </Button>
          {actions.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-md border-2 border-white">
              {actions.length}
            </span>
          )}
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b bg-slate-50/50 shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            KOSH AI Coach
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="actions" className="flex-1 flex flex-col min-h-0 w-full">
          <div className="px-6 pt-2 shrink-0">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="actions">Action List</TabsTrigger>
              <TabsTrigger value="chat">Chat Coach</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="actions" className="flex-1 overflow-y-auto p-6 bg-slate-50/30 min-h-0">
            <div className="space-y-3">
              {actions.map((item) => (
                <Card key={item.id} className={`border-l-4 ${
                  item.type === 'critical' ? 'border-l-red-500 bg-red-50/50' :
                  item.type === 'urgent' ? 'border-l-orange-500 bg-orange-50/50' :
                  'border-l-blue-500 bg-white'
                }`}>
                  <CardContent className="p-4 flex items-start gap-3">
                    {item.type === 'critical' ? <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" /> :
                     item.type === 'urgent' ? <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" /> :
                     <Info className="h-5 w-5 text-blue-600 mt-0.5" />}
                    <div>
                      <p className="font-medium text-sm">{item.text}</p>
                      <Badge variant="outline" className="mt-2 text-xs capitalize">{item.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 bg-white mt-0 border-t">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-lg px-4 py-2 text-sm relative group ${m.role === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-800"}`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    {m.image && (
                      <img src={m.image} alt="uploaded receipt" className="mt-2 w-full rounded-md max-w-[200px]" />
                    )}
                    
                    {m.role === 'assistant' && (
                        <button 
                            onClick={() => speakText(m.content)}
                            className="absolute -right-8 top-0 p-1 text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Volume2 className="h-4 w-4" />
                        </button>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                 <div className="flex justify-start">
                   <div className="bg-slate-100 rounded-lg px-4 py-2 text-sm text-slate-500 flex items-center gap-2">
                     <Loader2 className="h-3 w-3 animate-spin" /> Thinking...
                   </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Area */}
            <div className="p-4 border-t bg-slate-50 shrink-0 z-10 flex flex-col gap-2">
              
              {/* IMAGE PREVIEW AREA */}
              {previewUrl && (
                <div className="flex items-center gap-2 pb-2">
                   <div className="relative">
                      <img src={previewUrl} alt="Preview" className="h-16 w-16 object-cover rounded-md border border-slate-200" />
                      <button 
                        type="button"
                        onClick={handleRemoveFile}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                   </div>
                   <span className="text-xs text-muted-foreground">Receipt attached</span>
                </div>
              )}

              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={selectedFile ? "text-blue-600 bg-blue-50" : "text-muted-foreground"}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>

                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask KOSH..."
                  className="flex-1"
                />
                
                 <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={isListening ? "text-red-600 bg-red-50 animate-pulse" : "text-muted-foreground"}
                  onClick={startListening}
                >
                  <Mic className="h-4 w-4" />
                </Button>

                <Button type="submit" size="icon" disabled={isLoading || (!input && !selectedFile)}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}