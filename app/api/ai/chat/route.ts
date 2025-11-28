import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize the new client
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });

export async function POST(req: Request) {
  try {
    const { history, message, image, data } = await req.json();

    const healthScore = data?.healthScore ?? "unknown";
    const walletBalance = data?.walletBalance ?? "unknown";

    // 1. Prepare Content for the specific turn
    // The new SDK uses a simpler structure for parts
    const currentParts: any[] = [{ text: message }];

    if (image) {
        // image format: "data:image/jpeg;base64,..."
        // The new SDK often prefers simple Base64 strings or URIs. 
        // For raw base64, we can structure it like this:
        const [mimeMeta, base64Data] = image.split(",");
        const mimeType = mimeMeta.split(":")[1].split(";")[0];
        
        currentParts.push({
            inlineData: {
                data: base64Data,
                mimeType: mimeType
            }
        });
    }

    // 2. Construct History for Context
    // We map your frontend history to the SDK's expected format
    const contents = history.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
    }));

    // Add the current user message to the end of contents
    contents.push({
        role: "user",
        parts: currentParts
    });

    // 3. Generate Stream
    // Using gemini-1.5-flash as it is stable; use 2.5-flash if you have access
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: {
          parts: [{ text: `You are KOSH, a financial coach. 
            User Stats: Health Score ${healthScore}, Balance $${walletBalance}.
            - Be concise (max 3 sentences).
            - Be encouraging.
            - If an image is provided, analyze the receipt/bill details.` }]
        },
      },
      contents: contents,
    });

    // 4. Create a ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of response) {
            const text = chunk.text; // Access text property directly in new SDK
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err) {
          console.error("Stream processing error:", err);
          controller.error(err);
        }
      },
    });

    return new NextResponse(stream);

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}