import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("🚀 Nova AI Backend is running!");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    res.json({
      reply: result.text,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to get AI response",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Nova AI Backend running on port ${PORT}`);
});