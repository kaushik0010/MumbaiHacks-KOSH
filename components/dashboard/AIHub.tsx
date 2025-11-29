"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { Bot, Send, Paperclip, Sparkles, AlertCircle, Info, Loader2, Mic, Volume2, X, MessageCircle, Zap, Brain } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";

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
  timestamp: Date;
};

export default function AIHub({ healthScore, walletBalance, taxBalance, savingsHistory }: AIHubProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [actions, setActions] = useState<ActionItem[]>([]);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, previewUrl]);

  // Handle Image Preview URL generation/cleanup
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

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

  const getActionIcon = (type: string) => {
    switch (type) {
      case "critical": return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "urgent": return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case "suggestion": return <Zap className="h-4 w-4 text-blue-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case "critical": return "border-l-red-500 bg-red-50/50";
      case "urgent": return "border-l-orange-500 bg-orange-50/50";
      case "suggestion": return "border-l-blue-500 bg-blue-50/50";
      default: return "border-l-gray-500 bg-gray-50/50";
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "critical": return "destructive";
      case "urgent": return "default";
      case "suggestion": return "secondary";
      default: return "outline";
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/\p{Extended_Pictographic}/gu, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.3;
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
    if (!input.trim() && !selectedFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
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
    setSelectedFile(null);
    setPreviewUrl(null);
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
        { id: assistantMsgId, role: "assistant", content: "", timestamp: new Date() }
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
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now().toString(), 
          role: "assistant", 
          content: "Sorry, I'm having trouble connecting. Please try again.", 
          timestamp: new Date() 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: "Review my savings", prompt: "Analyze my current savings progress and give suggestions" },
    { label: "Tax advice", prompt: "What should I know about my tax obligations?" },
    { label: "Budget tips", prompt: "Give me personalized budget recommendations" },
    { label: "Health score", prompt: "Explain my financial health score and how to improve it" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="fixed bottom-6 right-6 z-50 cursor-pointer group">
          <div className="relative">
            <Button className="h-14 w-14 rounded-full shadow-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 group-hover:scale-110 group-hover:shadow-3xl cursor-pointer">
              <Bot className="h-6 w-6 text-white" />
            </Button>
            {actions.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-lg border-2 border-white animate-pulse">
                {actions.length}
              </span>
            )}
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] h-[700px] flex flex-col p-0 gap-0 border-2 rounded-xl overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-linear-to-r from-blue-600 to-indigo-600 text-white shrink-0">
          <DialogTitle className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-lg font-bold">KOSH AI Coach</div>
              <div className="text-sm font-normal text-blue-100">Your personal financial assistant</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="chat" className="flex-1 flex flex-col min-h-0 w-full">
          <div className="px-6 pt-4 shrink-0">
            <TabsList className="w-full grid grid-cols-2 bg-slate-100 p-1">
              <TabsTrigger value="chat" className="flex items-center gap-2 data-[state=active]:bg-white">
                <MessageCircle className="h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="actions" className="flex items-center gap-2 data-[state=active]:bg-white">
                <Sparkles className="h-4 w-4" />
                Actions {actions.length > 0 && `(${actions.length})`}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="actions" className="flex-1 p-0 m-0 min-h-0">
            <ScrollArea className="h-full p-6 bg-slate-50/30">
              <div className="space-y-4">
                {actions.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Sparkles className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                    <div>
                      <p className="font-semibold text-muted-foreground">No Actions Needed</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your finances are looking great! Keep up the good work.
                      </p>
                    </div>
                  </div>
                ) : (
                  actions.map((item) => (
                    <Card key={item.id} className={`border-l-4 ${getActionColor(item.type)} shadow-sm hover:shadow-md transition-shadow`}>
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className="shrink-0 mt-0.5">
                          {getActionIcon(item.type)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="font-medium text-sm text-gray-900 leading-relaxed">
                            {item.text}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant={getBadgeVariant(item.type)} className="capitalize text-xs">
                              {item.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {item.action}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 m-0 p-0 bg-white">
            <ScrollArea className="flex-1 p-4" ref={chatContainerRef}>
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-12 space-y-6">
                    <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-bold text-gray-900 text-lg">How can I help you today?</h3>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        Ask me about savings, taxes, budgeting, or upload receipts for analysis.
                      </p>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                      {quickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="h-auto py-2 text-xs border-2 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                          onClick={() => setInput(action.prompt)}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm relative group ${
                      m.role === "user" 
                        ? "bg-blue-600 text-white rounded-br-none" 
                        : "bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200"
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                      {m.image && (
                        <img src={m.image} alt="uploaded receipt" className="mt-2 w-full rounded-lg max-w-[200px] border" />
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs ${m.role === "user" ? "text-blue-200" : "text-muted-foreground"}`}>
                          {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        
                        {m.role === 'assistant' && (
                          <button 
                            onClick={() => speakText(m.content)}
                            className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Read aloud"
                          >
                            <Volume2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 rounded-2xl rounded-bl-none px-4 py-3 text-sm text-slate-600 flex items-center gap-2 border border-slate-200">
                      <Loader2 className="h-3 w-3 animate-spin" /> 
                      <span>Analyzing your request...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Form Area */}
            <div className="p-4 border-t bg-white shrink-0 z-10 flex flex-col gap-3">
              
              {/* IMAGE PREVIEW AREA */}
              {previewUrl && (
                <div className="flex items-center gap-3 pb-2">
                   <div className="relative">
                      <img src={previewUrl} alt="Preview" className="h-16 w-16 object-cover rounded-lg border-2 border-blue-200" />
                      <button 
                        type="button"
                        onClick={handleRemoveFile}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                   </div>
                   <div className="flex-1">
                     <span className="text-sm font-medium text-gray-700">Receipt attached</span>
                     <p className="text-xs text-muted-foreground">Ready for analysis</p>
                   </div>
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
                  variant="outline"
                  size="icon"
                  className={`h-11 w-11 border-2 cursor-pointer ${
                    selectedFile 
                      ? "text-blue-600 bg-blue-50 border-blue-200" 
                      : "text-muted-foreground border-slate-200 hover:border-blue-300"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>

                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about savings, taxes, or upload a receipt..."
                  className="flex-1 h-11 border-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  disabled={isLoading}
                />
                
                 <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className={`h-11 w-11 border-2 cursor-pointer ${
                    isListening 
                      ? "text-red-600 bg-red-50 border-red-200 animate-pulse" 
                      : "text-muted-foreground border-slate-200 hover:border-blue-300"
                  }`}
                  onClick={startListening}
                  disabled={isLoading}
                >
                  <Mic className="h-4 w-4" />
                </Button>

                <Button 
                  type="submit" 
                  size="icon" 
                  className="h-11 w-11 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  disabled={isLoading || (!input.trim() && !selectedFile)}
                >
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