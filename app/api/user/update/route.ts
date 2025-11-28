import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize the new client
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });

export async function POST(req: Request) {
  try {
    const { history, message, image, data } = await req.json();

    // 1. Extract Contextual Data
    const healthScore = data?.healthScore ?? "unknown";
    const walletBalance = data?.walletBalance ?? "unknown";
    const taxBalance = data?.taxBalance ?? 0;
    const savingsHistory = data?.savingsHistory || [];

    // 2. Format "Memory" (Past Achievements)
    const pastAchievements = savingsHistory.length > 0 
      ? savingsHistory.map((s: any) => `- Successfully saved $${s.amountSaved} for '${s.campaignName}'`).join("\n")
      : "No completed savings plans yet (New user).";

    // 3. Prepare Content for the specific turn
    const currentParts: any[] = [{ text: message }];

    if (image) {
        // Handle Base64 Image
        const [mimeMeta, base64Data] = image.split(",");
        const mimeType = mimeMeta.split(":")[1].split(";")[0];
        
        currentParts.push({
            inlineData: {
                data: base64Data,
                mimeType: mimeType
            }
        });
    }

    // 4. Construct Chat History
    const contents = history.map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
    }));

    // Add current message
    contents.push({
        role: "user",
        parts: currentParts
    });

    // 5. Generate Stream with Enhanced System Prompt
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: {
          parts: [{ text: `You are KOSH, an intelligent financial coach for gig workers.

            USER FINANCIAL PROFILE:
            - Financial Health Score: ${healthScore}/100
            - Available Wallet Balance: $${walletBalance}
            - Tax Vault (Locked by Agent): $${taxBalance}

            CONTEXTUAL MEMORY (PAST SUCCESS):
            ${pastAchievements}

            YOUR BEHAVIORAL GUIDELINES:
            1. **The Tax Agent:** If the user asks about money/income, remind them that the "Tax Trap Agent" has automatically secured 15% ($${taxBalance}) of their income into the Vault. Reinforce that this is for their safety.
            2. **Motivation:** Use their 'Contextual Memory' (past savings) to encourage them. Example: "You crushed your '${savingsHistory[0]?.campaignName || 'goal'}' before, you can do this too!"
            3. **Receipt Analysis:** If an image is uploaded, categorize items as 'Needs' vs 'Wants'.
            4. **Concise:** Keep responses punchy (max 3-4 sentences). Be high-energy and supportive.` }]
        },
      },
      contents: contents,
    });

    // 6. Create Readable Stream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of response) {
            const text = chunk.text; 
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