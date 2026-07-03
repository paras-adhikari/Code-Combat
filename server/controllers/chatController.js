// Simple AI chat controller using Groq's OpenAI-compatible Chat Completions
// API (free tier, no credit card required - get a key at
// https://console.groq.com/keys).
// Kept on the server so the API key is never exposed to the browser (unlike
// the Judge0 key, which was mistakenly put in the frontend code).
exports.askBot = async (req, res) => {
  const { message, history } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Message is required" });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({
      message:
        "AI bot is not configured yet. Add GROQ_API_KEY to server/.env to enable it (free key at https://console.groq.com/keys).",
    });
  }

  try {
    // history: optional array of { role: 'user' | 'assistant', content: string }
    // Groq expects role 'user' or 'assistant' directly, same as OpenAI.
    const messages = [
      {
        role: "system",
        content:
          "You are a friendly, concise coding-help assistant embedded inside the CodeCombat learning platform. Help users with programming questions, explain errors, and encourage them while they practice.",
      },
      ...(Array.isArray(history) ? history : []).map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", data);
      return res
        .status(502)
        .json({ message: data.error?.message || "AI bot failed to respond" });
    }

    const reply = data.choices?.[0]?.message?.content || "";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat bot error:", error);
    res.status(500).json({ message: "Failed to reach AI bot" });
  }
};
