import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with named parameters & user-agent telemetry as instructed in SKILL.md
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini SDK successfully initialized.");
  } catch (error) {
    console.error("Error initializing Gemini SDK:", error);
  }
} else {
  console.warn("GEMINI_API_KEY is not defined. AI Concierge will use helpful fallback answers.");
}

// Ensure data files exist for local persistence
const RSVPS_FILE = path.join(process.cwd(), "rsvps.json");
const WISHES_FILE = path.join(process.cwd(), "wishes.json");

if (!fs.existsSync(RSVPS_FILE)) {
  fs.writeFileSync(RSVPS_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(WISHES_FILE)) {
  const initialWishes = [
    { id: 1, name: "Sarah & David", message: "Wishing you both a lifetime of love, laughter, and beautiful cinematic moments! Congratulations Celine and Mousa!", date: "2026-07-02" },
    { id: 2, name: "Yousef Al-Masri", message: "ألف مبروك عريسنا الغالي موسى وللعروس الجميلة سلين. الله يتمملكم على خير وبركة وعقبال المئة سنة حب!", date: "2026-07-03" },
    { id: 3, name: "Elena Rostova", message: "Such a stunning couple! May your love story continue to grow more elegant and deep with every passing year.", date: "2026-07-03" }
  ];
  fs.writeFileSync(WISHES_FILE, JSON.stringify(initialWishes, null, 2));
}

// --- API ROUTES ---

// 1. RSVP Submission
app.post("/api/rsvp", (req, res) => {
  try {
    const { name, guests, phone, attendance, notes } = req.body;
    if (!name || attendance === undefined) {
      return res.status(400).json({ error: "Name and attendance status are required." });
    }

    const data = JSON.parse(fs.readFileSync(RSVPS_FILE, "utf-8"));
    const newRsvp = {
      id: Date.now(),
      name,
      guests: guests || 1,
      phone: phone || "",
      attendance,
      notes: notes || "",
      date: new Date().toISOString().split('T')[0]
    };

    data.push(newRsvp);
    fs.writeFileSync(RSVPS_FILE, JSON.stringify(data, null, 2));

    return res.json({ success: true, message: "Thank you! Your RSVP has been elegantly recorded.", rsvp: newRsvp });
  } catch (error) {
    console.error("Error writing RSVP:", error);
    return res.status(500).json({ error: "Failed to record RSVP." });
  }
});

// 2. Well Wishes (Get and Post)
app.get("/api/well-wishes", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(WISHES_FILE, "utf-8"));
    return res.json(data);
  } catch (error) {
    console.error("Error reading wishes:", error);
    return res.status(500).json({ error: "Failed to retrieve well wishes." });
  }
});

app.post("/api/well-wishes", (req, res) => {
  try {
    const { name, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: "Name and romantic message are required." });
    }

    const data = JSON.parse(fs.readFileSync(WISHES_FILE, "utf-8"));
    const newWish = {
      id: Date.now(),
      name,
      message,
      date: new Date().toISOString().split('T')[0]
    };

    data.unshift(newWish); // Add to the top
    fs.writeFileSync(WISHES_FILE, JSON.stringify(data, null, 2));

    return res.json({ success: true, wish: newWish });
  } catch (error) {
    console.error("Error writing wish:", error);
    return res.status(500).json({ error: "Failed to record your well wish." });
  }
});

// 3. AI Wedding Concierge Butler
app.post("/api/concierge", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Please provide a question." });
  }

  const weddingPrompt = `
You are the elegant, warm, and highly polished AI Wedding Concierge Butler for the cinematic wedding of Mousa & Celine.
Your voice is luxurious, polite, comforting, and deeply romantic (matching high-end parfum or wedding film aesthetics).
You can answer in English or Arabic, matching the language of the user's question, or provide elegant bilingual answers.

Here are the precise details of the wedding of Mousa and Celine:
- Groom: Mousa (موسى), an elegant, charming engineer.
- Bride: Celine (سلين), a creative, stunning designer.
- Date: Friday, July 17, 2026 (الجمعة ١٧ تموز ٢٠٢٦).
- Venue: Grand Views (مزرعة Grand Views) on Airport Road (طريق المطار), Amman, Jordan.
- Schedule:
  - Groom's traditional celebration/zaffeh (زفة العريس): Starts at 5:30 PM at the groom's family house.
  - Main Wedding Ceremony & Reception: Starts at 8:00 PM (٨:٠٠ مساءً) at Grand Views.
- Dress Code: Black Tie / Highly Elegant Formal. Guests are kindly requested to dress in deep rich colors and avoid wearing bridal white or ivory to respect the bride.
- Children policy: "Children's heaven is their homes" (جنة الأطفال منازلهم) - the wedding is an intimate, adults-only event.
- Valet & Parking: Complimentary luxury valet parking is provided at the main gates of Grand Views.
- RSVP Deadline: Please RSVP using the glassmorphic form on this website before June 20, 2026.
- Gift registry or contributions: The couple values your presence and warm wishes above all. For those wishing to honor them, a gift box will be present at the reception hall.

Keep responses relatively concise (under 3-4 sentences), incredibly polite, welcoming, and elegant. If the question is not about the wedding, gently guide them back to the romantic celebration.
`;

  if (!ai) {
    // Elegant fallback if no API key is set
    const lowerMessage = message.toLowerCase();
    let reply = "Welcome, beloved guest! Mousa and Celine's wedding is on Friday, July 17, 2026, at 8:00 PM in the gorgeous Grand Views on Airport Road. We would love to celebrate with you!";
    if (lowerMessage.includes("dress") || lowerMessage.includes("wear")) {
      reply = "For our special night, the dress code is elegant Black Tie. We kindly request guests dress in sophisticated formal attire, avoiding bridal white or ivory. We cannot wait to see you shine!";
    } else if (lowerMessage.includes("child") || lowerMessage.includes("kid")) {
      reply = "To allow all guests a night of relaxation and elegant celebrations, we have chosen for our wedding day to be an adults-only occasion ('Children's heaven is their homes'). We appreciate your understanding!";
    } else if (lowerMessage.includes("time") || lowerMessage.includes("hour") || lowerMessage.includes("schedule")) {
      reply = "The celebrations begin with the groom's traditional zaffeh at 5:30 PM at his family's home, followed by the main ceremony and reception at Grand Views, Airport Road at 8:00 PM.";
    } else if (lowerMessage.includes("location") || lowerMessage.includes("where") || lowerMessage.includes("venue")) {
      reply = "Our beautiful celebration takes place at Grand Views, a breathtaking estate located on Airport Road in Amman, Jordan. Complimentary luxury valet is provided at the entrance.";
    }
    return res.json({ reply });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: weddingPrompt,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I am so delighted to welcome you. How else may I assist you with Mousa and Celine's grand day?";
    return res.json({ reply });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.json({ reply: "I am here to welcome you with the warmest affection. The cinematic wedding of Mousa and Celine is on Friday, July 17, 2026, at 8:00 PM at Grand Views. Please let me know how I can assist you!" });
  }
});

// --- VITE DEV AND PROD SERVING ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production files from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Luxury Wedding Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
