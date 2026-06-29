import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { inputPrompt, systemContext, model } = await req.json();

    if (!inputPrompt) {
      return NextResponse.json(
        { error: "inputPrompt is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured in .env" },
        { status: 500 }
      );
    }

    const messages = [];
    if (systemContext) {
      messages.push({ role: "system", content: systemContext });
    }
    messages.push({ role: "user", content: inputPrompt });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || "gpt-4o",
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Error calling OpenAI API" },
        { status: response.status }
      );
    }

    const aiResponse = data.choices[0]?.message?.content || "";

    return NextResponse.json({ aiResponse });
  } catch (error) {
    console.error("Error executing prompt:", error);
    return NextResponse.json(
      { error: "Failed to execute prompt" },
      { status: 500 }
    );
  }
}
