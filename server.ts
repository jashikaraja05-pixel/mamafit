import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Enable CORS and secure headers for cloud IDE iframe and cross-origin environments
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

app.use(express.json());

// Initialize Gemini Client server-side
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Helpers for trimester and baby size comparison
function getTrimesterInfo(week: number) {
  if (week <= 13) return { trimester: 1, name: 'First Trimester' };
  if (week <= 26) return { trimester: 2, name: 'Second Trimester' };
  return { trimester: 3, name: 'Third Trimester' };
}

// 1. Health-check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    app: 'MamaFit AI – Pregnancy Wellness Companion',
    environment: process.env.NODE_ENV || 'development',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    port: PORT,
  });
});

// 2. AI Coach API
app.post('/api/coach', async (req: Request, res: Response) => {
  try {
    const { message, history = [], profile } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const week = profile?.pregnancyWeek || 16;
    const mamaName = profile?.name || 'Mama';
    const triInfo = getTrimesterInfo(week);

    const systemInstruction = `You are MamaFit AI, an empathetic, warm, evidence-based pregnancy wellness companion.
You are conversing with ${mamaName}, who is currently in Week ${week} of pregnancy (${triInfo.name}).
Her baby nickname is "${profile?.babyNickname || 'Little Miracle'}".

Guidelines:
1. Tone: Deeply supportive, reassuring, warm, maternal, and positive. Sprinkle friendly touches like 🌸, 💛, ✨, 💧.
2. Trimester-Aware: Provide guidance specifically tailored to Week ${week} and ${triInfo.name} changes, common sensations, and wellness tips.
3. Wellness Scope: Focus on gentle pregnancy wellness, hydration, prenatal nutrition, safe movement, pelvic floor care, sleep ergonomics, and mental serenity.
4. Pregnancy Safety & Medical Boundary: You are an educational wellness companion, NOT an OB-GYN or diagnostic physician. Do not diagnose conditions or prescribe medications.
5. Red Flag Symptoms: If the user mentions vaginal bleeding, severe cramping, leaking fluid, visual disturbances, severe sudden swelling, high fever, or noticeably reduced fetal kicks, immediately instruct them with compassionate urgency to contact their OB-GYN, midwife, or local maternity hospital emergency department.
6. Format: Keep responses concise (2-4 brief paragraphs or clean bullet points), easy to read on a mobile device, ending with an encouraging mama affirmation.`;

    // Try Gemini API if key is available
    if (ai) {
      try {
        const contents: any[] = [];

        // Include recent history (up to last 6 messages)
        if (Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            if (item.role === 'user' || item.role === 'assistant' || item.role === 'model') {
              contents.push({
                role: item.role === 'assistant' ? 'model' : item.role,
                parts: [{ text: String(item.content) }],
              });
            }
          }
        }

        // Add current user prompt
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            topP: 0.95,
          },
        });

        const text = response.text;
        if (text && text.trim().length > 0) {
          res.json({ reply: text.trim() });
          return;
        }
      } catch (genErr: any) {
        console.warn('Gemini API call failed, falling back to smart wellness engine:', genErr?.message);
      }
    }

    // Smart fallback maternal response engine
    const lower = message.toLowerCase();
    let fallback = '';

    if (lower.includes('nause') || lower.includes('morning sickness') || lower.includes('vomit')) {
      fallback = `Oh mama, nausea can be so tough 💛 Here are gentle, pregnancy-safe tips:
• Keep plain crackers or dry toast at your bedside and nibble before getting up.
• Sip cool iced ginger tea or water with lemon slices throughout the day.
• Eat small, frequent protein-rich snacks (like almonds or yogurt) so your stomach never feels completely empty.
• Vitamin B6 is often recommended by midwives for mild nausea.

If you cannot keep liquids down for 24 hours, please reach out to your doctor or midwife right away. Sending you gentle comfort 🌸`;
    } else if (lower.includes('iron') || lower.includes('anemi') || lower.includes('food')) {
      fallback = `Iron is wonderful for growing your baby's blood supply and keeping your energy high in ${triInfo.name} 🥑!

Great pregnancy-safe sources:
• Cooked lentils, chickpeas, and moong dal
• Well-steamed spinach and dark leafy greens
• Lean meats and low-mercury cooked fish
• Fortified whole grains and pumpkin seeds

💡 Pro tip: Pair iron foods with Vitamin C (like bell peppers, citrus, or strawberries) to boost absorption! Avoid taking calcium/dairy at the exact same minute as your iron pill, as calcium competes for absorption. You're doing amazing! 🌸`;
    } else if (lower.includes('water') || lower.includes('hydrat')) {
      fallback = `Staying well-hydrated is one of the most loving gifts for both your body and your baby right now 💧!

Aim for 2.3 to 2.8 Liters (about 8–10 cups) daily. Hydration keeps amniotic fluid replenished, helps deliver nutrients to placenta, and prevents muscle cramps. Check out the new Hydration Tracker on your Home page to log your glasses today! 🌸`;
    } else if (lower.includes('exercise') || lower.includes('workout') || lower.includes('safe') || lower.includes('walk')) {
      fallback = `Gentle movement is a gift for both you and baby right now in Week ${week} 🌿!

Safe exercises to enjoy:
• 15–20 minute brisk gentle walks in comfortable supportive shoes
• Prenatal yoga with gentle hip openers and cat-cow stretches
• Pelvic floor Kegels (tighten, hold 3–5 seconds, release)
• Swimming or water aerobics to relieve belly pressure

⚠️ Safety note: Avoid high-impact bouncing, contact sports, or lying flat on your back for prolonged periods in trimester 2 and 3. Drink plenty of water and stop immediately if you feel dizzy or short of breath! 💛`;
    } else if (lower.includes('tire') || lower.includes('fatigue') || lower.includes('sleep') || lower.includes('exhaust')) {
      fallback = `Pregnancy fatigue is your body's honest reminder that you're literally building human organs and bones 24/7 ✨!

Gentle rest remedies:
• Sleep on your left side with a supportive pregnancy pillow between your knees and under your bump to optimize blood flow.
• Honor a 15-minute midday power nap or feet-up resting break.
• Check in on your hydration—aim for 2.5L of water daily.
• Mention persistent exhaustion at your next prenatal appointment to check your ferritin (iron) levels.

Rest without guilt, sweet mama—you're doing miraculous work 💛`;
    } else if (lower.includes('kick') || lower.includes('movement') || lower.includes('flutter')) {
      fallback = `Feeling those little flutters and kicks is one of the most magical parts of pregnancy 💗!

In Week ${week}, your baby has awake and sleep cycles. Notice when they are most active—often after you have a meal, sip cold water, or lie down in the evening.

💡 Counting kicks: From week 28 onward, doctors typically recommend feeling 10 distinct movements within a 2-hour window when baby is active. If you ever feel a noticeable decrease in baby's habitual movement, drink cold water, lie on your left side, and if movements still feel diminished, contact your maternity ward or OB-GYN immediately! 🌸`;
    } else {
      fallback = `Hello beautiful mama 🌸 I'm here right by your side during Week ${week} of your journey!

Whether you need meal ideas, gentle pelvic floor stretches, hydration tracking encouragement, or just a listening ear, I'm here for you.

Remember to take a gentle sip of water today, take a deep breath, and trust your remarkable body 💛 (And as always, remember to consult your healthcare provider for any medical diagnoses or urgent concerns!) How can I support you right now?`;
    }

    res.json({ reply: fallback });
  } catch (error: any) {
    console.error('Coach endpoint error:', error);
    res.status(500).json({
      error: 'Unable to process wellness guidance at this time',
      fallback: "I'm right here with you mama 💛 Please take a gentle sip of water and check back in a moment.",
    });
  }
});

// Setup Vite development server or static file serving
async function startServer() {
  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        // Bind Vite HMR WebSocket server directly to the Node.js httpServer
        hmr: isHmrDisabled
          ? false
          : {
              server: httpServer,
            },
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 MamaFit AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
