import { WeekGrowthData } from '../types';

export const PREGNANCY_WEEKS: Record<number, WeekGrowthData> = {
  4: {
    week: 4,
    trimester: 1,
    fruitComparison: 'Poppy Seed',
    fruitEmoji: '🌱',
    lengthCm: 0.1,
    weightG: 0.04,
    babyHighlight: 'The blastocyst is officially settling into your uterine lining.',
    mamaTip: 'Start your daily prenatal vitamins with at least 400mcg of folic acid.',
    affirmation: 'A tiny universe of love has begun to grow within me.',
  },
  8: {
    week: 8,
    trimester: 1,
    fruitComparison: 'Raspberry',
    fruitEmoji: '🫐',
    lengthCm: 1.6,
    weightG: 1.0,
    babyHighlight: 'Tiny fingers and toes are forming, and the neural pathways are branching.',
    mamaTip: 'Stay hydrated with small, regular sips of cold water or ginger infusions for nausea.',
    affirmation: 'I trust my body to nurture this sweet little life.',
  },
  12: {
    week: 12,
    trimester: 1,
    fruitComparison: 'Plum',
    fruitEmoji: '🍑',
    lengthCm: 5.4,
    weightG: 14,
    babyHighlight: 'All essential organs are fully formed, and baby can curl tiny fingers.',
    mamaTip: 'Morning sickness often begins easing as your placenta takes over progesterone.',
    affirmation: 'Every heartbeat is a gentle song of growth and vitality.',
  },
  16: {
    week: 16,
    trimester: 2,
    fruitComparison: 'Avocado',
    fruitEmoji: '🥑',
    lengthCm: 11.6,
    weightG: 100,
    babyHighlight: 'Baby can hear your voice and is beginning to make facial expressions.',
    mamaTip: 'Talk or sing gently to your bump—baby finds your voice deeply soothing.',
    affirmation: 'My body is strong, soft, and completely capable of this miracle.',
  },
  20: {
    week: 20,
    trimester: 2,
    fruitComparison: 'Banana',
    fruitEmoji: '🍌',
    lengthCm: 25.6,
    weightG: 300,
    babyHighlight: 'Halfway milestone! Baby has soft lanugo hair and practices swallowing.',
    mamaTip: 'Celebrate reaching the halfway mark! Consider booking your anatomy scan.',
    affirmation: 'I embrace each flutter and wave of life inside me.',
  },
  24: {
    week: 24,
    trimester: 2,
    fruitComparison: 'Ear of Corn',
    fruitEmoji: '🌽',
    lengthCm: 30.0,
    weightG: 600,
    babyHighlight: 'Baby’s taste buds are developing, and lung branches are preparing for breathing.',
    mamaTip: 'Keep up gentle walking and stay hydrated to prevent leg cramps and swelling.',
    affirmation: 'We are growing together with grace, joy, and serene strength.',
  },
  28: {
    week: 28,
    trimester: 3,
    fruitComparison: 'Eggplant',
    fruitEmoji: '🍆',
    lengthCm: 37.6,
    weightG: 1000,
    babyHighlight: 'Welcome to the 3rd Trimester! Baby can open and close their eyes to light.',
    mamaTip: 'Begin counting daily fetal kicks—aim for 10 movements within a 2-hour window.',
    affirmation: 'I welcome this final chapter with patience, peace, and excitement.',
  },
  32: {
    week: 32,
    trimester: 3,
    fruitComparison: 'Pineapple',
    fruitEmoji: '🍍',
    lengthCm: 42.4,
    weightG: 1700,
    babyHighlight: 'Bones are hardening (except the skull, which stays pliable for delivery).',
    mamaTip: 'Practice pelvic floor breathing and side-sleeping with supportive pillows.',
    affirmation: 'Every breath relaxes my mind and readies my body for birth.',
  },
  36: {
    week: 36,
    trimester: 3,
    fruitComparison: 'Honeydew Melon',
    fruitEmoji: '🍈',
    lengthCm: 47.4,
    weightG: 2600,
    babyHighlight: 'Baby is gaining rapid protective baby fat and dropping into the pelvic inlet.',
    mamaTip: 'Pack your hospital birth bag and ensure your newborn car seat is installed.',
    affirmation: 'I am surrounded by love, readiness, and calm anticipation.',
  },
  40: {
    week: 40,
    trimester: 3,
    fruitComparison: 'Watermelon',
    fruitEmoji: '🍉',
    lengthCm: 51.2,
    weightG: 3500,
    babyHighlight: 'Full term! Your baby is completely ready to meet their wonderful mother.',
    mamaTip: 'Rest as much as possible, keep your pelvis relaxed, and trust your intuition.',
    affirmation: 'My body knows exactly how to bring my baby safely into the world.',
  },
};

export function getWeekGrowth(week: number): WeekGrowthData {
  if (PREGNANCY_WEEKS[week]) return PREGNANCY_WEEKS[week];

  // Interpolate closest
  const weeks = Object.keys(PREGNANCY_WEEKS).map(Number).sort((a, b) => a - b);
  let closest = weeks[0];
  for (const w of weeks) {
    if (w <= week) closest = w;
  }
  const base = PREGNANCY_WEEKS[closest];
  const trimester: 1 | 2 | 3 = week <= 13 ? 1 : week <= 26 ? 2 : 3;

  return {
    week,
    trimester,
    fruitComparison: base.fruitComparison,
    fruitEmoji: base.fruitEmoji,
    lengthCm: Math.round((base.lengthCm + (week - closest) * 1.2) * 10) / 10,
    weightG: Math.round(base.weightG + (week - closest) * 90),
    babyHighlight: base.babyHighlight,
    mamaTip: base.mamaTip,
    affirmation: base.affirmation,
  };
}
