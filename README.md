# MamaFit AI – Pregnancy Wellness Companion 🌸

MamaFit AI is a warm, evidence-based, AI-powered pregnancy wellness web application crafted to accompany expectant mothers through every week and trimester of pregnancy.

Designed to mirror the visual and functional elegance of the Radiant Mama AI platform, themed with maternal warmth (soft rose, blush, violet, and peach), featuring prenatal nutrition, hydration tracking, gentle exercises, fetal kick counter, and Gemini-powered trimester-aware coaching.

---

## 🌟 Core Features

1. **Daily Pregnancy Wellness Dashboard**
   - Time-sensitive greeting personalized with mama's name.
   - Week-by-week baby development with fruit/vegetable size comparisons (e.g., Week 24: Ear of Corn), estimated baby length & weight, and countdown to due date.
   - Circular daily wellness health score ring (0–100) aggregating hydration, movement, sleep, nutrition, and prenatal vitamins.
   - Quick-log cards for water, gentle steps, calories, and side-sleep hours.
   - Daily maternal affirmation & mood tracker.

2. **Prenatal Nutrition & Food Safety Checker**
   - Daily macros & micronutrients breakdown with special tracking for critical pregnancy nutrients: **Iron** (27mg goal), **Calcium** (1,000mg goal), **Protein**, and **Fiber**.
   - Curated list of pregnancy-safe foods (Greek Yogurt, Oatmeal with Chia, Avocado Toast, Wild Salmon, Moong Dal Khichdi, Idli + Sambar, Almond Milk).
   - Custom meal logger with automatic calorie and nutrient calculation.
   - **"Is It Safe to Eat?" Pregnancy Food Checker**: Instant safety rating (Safe, Caution, Avoid) with clinical explanations for seafood (sushi vs. cooked salmon), cheeses (brie vs. pasteurized cheddar), caffeine limits, and deli meats.

3. **Activity & Maternal Vitals Tracker**
   - Hydration cup logger with visual progress ring, +250ml and +500ml quick-add actions, and scheduled hydration reminders.
   - **Gentle Walking Tracker**: Live stopwatch timer tracking duration and estimated gentle steps.
   - **Fetal Kick Counter**: 1-tap counter tracking towards the clinical 10-kick milestone within 2 hours, with timestamp logs.
   - Sleep & Rest log with side-sleeping ergonomics recommendations.
   - Daily pregnancy sensations journal (nausea, heartburn, Braxton Hicks, round ligament stretch, glowing skin).

4. **Safe Prenatal Movement & Pelvic Floor Coach**
   - 6 curated prenatal routines: Prenatal Yoga, Calming Breathwork, Full Body Stretch, Light Walk, Pelvic Floor & Kegels, Guided Baby Meditation.
   - **Active Workout Session Timer**: Integrated stopwatch with step-by-step guidance, benefits, and video guide links.
   - **Interactive Kegel & Pelvic Floor Gym**: Visual contracting and relaxing rhythm trainer with 5-second hold countdowns and rep counters.
   - Clear guidelines on when to immediately stop exercising and consult medical care.

5. **MamaFit AI Pregnancy Wellness Coach**
   - Powered by Google Gemini AI (`gemini-flash-latest`) via server-side `/api/coach`.
   - Empathetic, supportive, maternal tone tailored to mama's exact pregnancy week and baby's development.
   - Quick prompt chips for morning sickness, iron-rich foods, safe stretches, fatigue, and kick counts.
   - Strict medical safety guardrails distinguishing wellness encouragement from clinical diagnosis.

6. **Mama Profile & Health Export**
   - Expectant mama details, due date calculator, and baby's nickname.
   - Gestational weight gain tracker with pre-pregnancy BMI classification and clinical weight gain ranges.
   - 1-click **Health Summary Export (JSON)** for OB-GYN and midwife prenatal appointments.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/mamafit-ai.git
cd mamafit-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Add your Google Gemini API key:
```env
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

### 4. Run Development Server
```bash
npm run dev
```
The application will be running at [http://localhost:3000](http://localhost:3000).

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🔒 Healthcare & Medical Disclaimer

MamaFit AI is designed solely for educational, wellness, and lifestyle support during pregnancy. It does **not** provide medical diagnoses, treatment plans, or clinical prescriptions. Pregnant women should always consult their licensed obstetrician, gynecologist, midwife, or primary care provider regarding any health conditions, changes in symptoms, or urgent medical concerns.

---

## 📦 GitHub Repository Setup

To push this project to your GitHub account:

1. Create a new repository named `mamafit-ai` at [https://github.com/new](https://github.com/new).
2. Run the following commands in the project root:
```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/mamafit-ai.git
git branch -M main
git push -u origin main
```
