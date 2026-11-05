import express from "express";
import cors from "cors";
import Groq from "groq-sdk";

const app = express();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.use(
  cors({
    origin: [
      "https://nicolegodot0209.github.io",
      "http://127.0.0.1:5500",
      "http://localhost:5500"
    ]
  })
);

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.send("FBLA AI backend is running!");
});

app.post("/chat", async (req, res) => {
  const message = req.body?.message;

  if (
    typeof message !== "string" ||
    !message.trim() ||
    message.length > 2000
  ) {
    return res.status(400).json({
      error: "Please send a message between 1 and 2,000 characters."
    });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content:
            "You are a friendly school-resource assistant for an " +
            "FBLA website. Keep answers short and clear. " +
            "Do not invent school contacts, events, policies, or links. " +
            "If information has not been provided, say you don't know. " +
            "You are not a counselor and must not diagnose or provide treatment. " +
            "Provide links to resources only when you know they are accurate."
        },
        {
          role: "user",
          content: message.trim()
        }
      ],

      max_completion_tokens: 400
    });

    const reply = completion.choices[0]?.message?.content;

    if (!reply) {
      throw new Error("Empty AI response");
    }

    res.json({ reply });
  } catch (error) {
    console.error(
      "Groq request failed:",
      error.status || error.name
    );

    res.status(502).json({
      error: "The AI couldn't respond. Please try again later."
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});