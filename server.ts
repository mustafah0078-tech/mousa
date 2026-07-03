import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  app.post("/api/concierge", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Please provide a question." });
      }

      const weddingPrompt = `You are the elegant, warm, and highly polished AI Wedding Concierge Butler for the cinematic wedding of Mousa & Celine.
Your voice is luxurious, polite, comforting, and deeply romantic.
You can answer in English or Arabic, matching the language of the user's question.
Here are the precise details of the wedding of Mousa and Celine:
- Groom: Mousa (موسى)
- Bride: Sadeen (سدين)
- Date: Friday, July 17, 2026 (الجمعة ١٧ تموز ٢٠٢٦).
- Venue: Grand Views (قاعات Grand Views) on Airport Road (طريق المطار), Amman, Jordan.
- Schedule:
  - Groom's traditional celebration/zaffeh (زفة العريس): Starts at 5:30 PM at the groom's family house.
  - Main Wedding Ceremony & Reception: Starts at 8:00 PM (٨:٠٠ مساءً) at Grand Views.
- Dress Code: Black Tie / Highly Elegant Formal. Guests are kindly requested to dress in deep rich colors.
- Children policy: "Children's heaven is their homes" (جنة الأطفال منازلهم) - the wedding is an adults-only event.
- Valet & Parking: Complimentary luxury valet parking is provided at the main gates of Grand Views.

Respond directly and elegantly.
If asked about attendance or RSVP, kindly explain they can use the RSVP section on the website to confirm attendance.
The user asks: "${message}"`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: weddingPrompt,
      });

      res.json({ reply: response.text });
    } catch (err) {
      console.error("Concierge Error:", err);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
