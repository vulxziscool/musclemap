export interface CardioActivity {
  name: string;
  category: "running" | "cycling" | "swimming" | "rowing" | "hiit" | "sports" | "other";
  calPerMinLow: number;
  calPerMinHigh: number;
  icon: string;
}

export const CARDIO_ACTIVITIES: CardioActivity[] = [
  // Running
  { name: "Walking (3 mph)", category: "running", calPerMinLow: 3.5, calPerMinHigh: 5, icon: "🚶" },
  { name: "Brisk Walking (4 mph)", category: "running", calPerMinLow: 5, calPerMinHigh: 7, icon: "🚶" },
  { name: "Jogging (5 mph)", category: "running", calPerMinLow: 8, calPerMinHigh: 11, icon: "🏃" },
  { name: "Running (6 mph)", category: "running", calPerMinLow: 10, calPerMinHigh: 13, icon: "🏃" },
  { name: "Running (7 mph)", category: "running", calPerMinLow: 11.5, calPerMinHigh: 15, icon: "🏃" },
  { name: "Running (8 mph)", category: "running", calPerMinLow: 13, calPerMinHigh: 17, icon: "🏃" },
  { name: "Sprint Intervals", category: "running", calPerMinLow: 14, calPerMinHigh: 20, icon: "⚡" },
  { name: "Trail Running", category: "running", calPerMinLow: 10, calPerMinHigh: 15, icon: "🏔️" },
  { name: "Treadmill Incline Walk", category: "running", calPerMinLow: 6, calPerMinHigh: 10, icon: "📐" },
  { name: "Stair Climbing", category: "running", calPerMinLow: 8, calPerMinHigh: 12, icon: "🪜" },
  // Cycling
  { name: "Cycling (casual)", category: "cycling", calPerMinLow: 5, calPerMinHigh: 8, icon: "🚲" },
  { name: "Cycling (moderate)", category: "cycling", calPerMinLow: 8, calPerMinHigh: 12, icon: "🚲" },
  { name: "Cycling (vigorous)", category: "cycling", calPerMinLow: 12, calPerMinHigh: 16, icon: "🚴" },
  { name: "Spin Class", category: "cycling", calPerMinLow: 10, calPerMinHigh: 15, icon: "🚴" },
  { name: "Stationary Bike", category: "cycling", calPerMinLow: 7, calPerMinHigh: 12, icon: "🚲" },
  { name: "Mountain Biking", category: "cycling", calPerMinLow: 9, calPerMinHigh: 14, icon: "🏔️" },
  // Swimming
  { name: "Swimming (leisurely)", category: "swimming", calPerMinLow: 5, calPerMinHigh: 8, icon: "🏊" },
  { name: "Swimming (moderate)", category: "swimming", calPerMinLow: 8, calPerMinHigh: 12, icon: "🏊" },
  { name: "Swimming (vigorous)", category: "swimming", calPerMinLow: 11, calPerMinHigh: 15, icon: "🏊" },
  { name: "Swimming Laps (freestyle)", category: "swimming", calPerMinLow: 9, calPerMinHigh: 14, icon: "🏊" },
  { name: "Water Aerobics", category: "swimming", calPerMinLow: 4, calPerMinHigh: 7, icon: "💧" },
  // Rowing
  { name: "Rowing Machine (easy)", category: "rowing", calPerMinLow: 6, calPerMinHigh: 9, icon: "🚣" },
  { name: "Rowing Machine (moderate)", category: "rowing", calPerMinLow: 9, calPerMinHigh: 13, icon: "🚣" },
  { name: "Rowing Machine (intense)", category: "rowing", calPerMinLow: 12, calPerMinHigh: 17, icon: "🚣" },
  // HIIT
  { name: "HIIT Circuit", category: "hiit", calPerMinLow: 12, calPerMinHigh: 18, icon: "⚡" },
  { name: "Tabata Training", category: "hiit", calPerMinLow: 13, calPerMinHigh: 20, icon: "⚡" },
  { name: "Burpees", category: "hiit", calPerMinLow: 10, calPerMinHigh: 15, icon: "💥" },
  { name: "Jump Rope", category: "hiit", calPerMinLow: 10, calPerMinHigh: 14, icon: "⏭️" },
  { name: "Battle Ropes", category: "hiit", calPerMinLow: 10, calPerMinHigh: 15, icon: "🪢" },
  { name: "Box Jumps", category: "hiit", calPerMinLow: 9, calPerMinHigh: 14, icon: "📦" },
  { name: "Kettlebell Swings (cardio)", category: "hiit", calPerMinLow: 10, calPerMinHigh: 15, icon: "🔔" },
  // Sports
  { name: "Basketball", category: "sports", calPerMinLow: 8, calPerMinHigh: 12, icon: "🏀" },
  { name: "Soccer", category: "sports", calPerMinLow: 8, calPerMinHigh: 13, icon: "⚽" },
  { name: "Tennis", category: "sports", calPerMinLow: 7, calPerMinHigh: 11, icon: "🎾" },
  { name: "Boxing (heavy bag)", category: "sports", calPerMinLow: 9, calPerMinHigh: 14, icon: "🥊" },
  { name: "Kickboxing", category: "sports", calPerMinLow: 10, calPerMinHigh: 15, icon: "🥊" },
  { name: "Martial Arts", category: "sports", calPerMinLow: 9, calPerMinHigh: 14, icon: "🥋" },
  { name: "Hiking", category: "sports", calPerMinLow: 6, calPerMinHigh: 10, icon: "🥾" },
  { name: "Rock Climbing", category: "sports", calPerMinLow: 8, calPerMinHigh: 13, icon: "🧗" },
  // Other
  { name: "Elliptical Trainer", category: "other", calPerMinLow: 7, calPerMinHigh: 12, icon: "🏋️" },
  { name: "Stair Master", category: "other", calPerMinLow: 8, calPerMinHigh: 13, icon: "🪜" },
  { name: "Yoga (power/flow)", category: "other", calPerMinLow: 4, calPerMinHigh: 7, icon: "🧘" },
  { name: "Dancing", category: "other", calPerMinLow: 5, calPerMinHigh: 10, icon: "💃" },
  { name: "Jump Squats", category: "other", calPerMinLow: 10, calPerMinHigh: 14, icon: "🦵" },
  { name: "Sled Push", category: "other", calPerMinLow: 12, calPerMinHigh: 18, icon: "🛷" },
];

export const CARDIO_CATEGORIES = [
  { id: "running", label: "Running & Walking" },
  { id: "cycling", label: "Cycling" },
  { id: "swimming", label: "Swimming" },
  { id: "rowing", label: "Rowing" },
  { id: "hiit", label: "HIIT & Intervals" },
  { id: "sports", label: "Sports & Activities" },
  { id: "other", label: "Other" },
];

export const FITNESS_TIPS = [
  "Progressive overload is the #1 driver of muscle growth — increase weight, reps, or sets over time.",
  "Sleep 7–9 hours per night. Growth hormone peaks during deep sleep, which is essential for muscle repair.",
  "Muscles need 48–72 hours to fully recover. Training a muscle before it recovers can reduce growth.",
  "Drinking water improves strength by up to 19%. Aim for half your body weight in ounces daily.",
  "Compound movements (squats, deadlifts, bench press) recruit the most muscle fibers per exercise.",
  "Eating 0.7–1g of protein per pound of body weight daily maximizes muscle protein synthesis.",
  "Taking 2–3 minute rest periods between heavy sets allows full ATP regeneration for maximum strength.",
  "Eccentric (lowering) phase of a rep causes more muscle damage and growth than the concentric phase.",
  "A 10-minute warm-up increases muscle temperature, improving contraction speed by up to 20%.",
  "Stretching after workouts reduces DOMS (delayed onset muscle soreness) by increasing blood flow.",
  "Creatine monohydrate is the most researched and effective legal supplement for strength gains.",
  "Your body burns more calories digesting protein than fats or carbs — this is called the thermic effect.",
  "Training in the 6–12 rep range is optimal for hypertrophy (muscle size growth).",
  "Grip strength is correlated with overall longevity. Farmer's walks and dead hangs improve it.",
  "Mind-muscle connection matters — focusing on the target muscle increases its activation by up to 26%.",
  "Walking 10,000 steps daily burns approximately 300–500 extra calories depending on body weight.",
  "Deload weeks (reduced volume/intensity) every 4–6 weeks prevent overtraining and allow supercompensation.",
  "Post-workout protein timing matters less than total daily protein intake. The 'anabolic window' is 24+ hours.",
  "Caffeine consumed 30 minutes before training can increase strength output by 3–5%.",
  "High-intensity interval training (HIIT) burns more fat in less time than steady-state cardio.",
  "Your muscles are approximately 79% water. Staying hydrated directly impacts performance.",
  "Resistance training increases bone density, reducing osteoporosis risk by up to 40%.",
  "The squat activates more muscle mass than any other single exercise — over 200 muscles involved.",
  "Slow negatives (3–4 seconds down) increase time under tension and stimulate more muscle growth.",
  "Vitamin D deficiency reduces testosterone levels. Get 15 minutes of sunlight or supplement 2000–5000 IU daily.",
  "Training legs releases the highest amount of growth hormone and testosterone of any body part.",
  "Heart rate zone 2 cardio (60–70% max HR) is the most efficient for fat oxidation.",
  "Cold showers post-workout may reduce inflammation but can blunt muscle growth if done immediately after.",
  "Magnesium supplementation improves sleep quality and reduces muscle cramps during training.",
  "The average person can build 1–2 lbs of muscle per month as a beginner, tapering to 0.5 lb with experience.",
];
