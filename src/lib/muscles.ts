export interface MuscleInfo {
  id: string;
  name: string;
  description: string;
  function: string;
  region: "upper_push" | "upper_pull" | "lower_body" | "core";
  view: "front" | "back" | "both";
  recommendedExercises: string[];
}

export const MUSCLES: MuscleInfo[] = [
  {
    id: "upper_chest",
    name: "Upper Chest",
    description: "The clavicular head of the pectoralis major, originating from the clavicle.",
    function: "Shoulder flexion and horizontal adduction at higher angles.",
    region: "upper_push",
    view: "front",
    recommendedExercises: ["Incline Bench Press", "Incline Dumbbell Press", "Low-to-High Cable Flyes"],
  },
  {
    id: "mid_chest",
    name: "Mid Chest",
    description: "The sternal head of the pectoralis major, the largest portion of the chest.",
    function: "Horizontal adduction and shoulder flexion.",
    region: "upper_push",
    view: "front",
    recommendedExercises: ["Bench Press", "Dumbbell Bench Press", "Cable Crossovers"],
  },
  {
    id: "lower_chest",
    name: "Lower Chest",
    description: "The costal and abdominal portions of the pectoralis major.",
    function: "Shoulder extension and horizontal adduction from elevated positions.",
    region: "upper_push",
    view: "front",
    recommendedExercises: ["Decline Bench Press", "Dips", "High-to-Low Cable Flyes"],
  },
  {
    id: "front_delts",
    name: "Front Deltoids",
    description: "The anterior head of the deltoid muscle, covering the front of the shoulder.",
    function: "Shoulder flexion and internal rotation.",
    region: "upper_push",
    view: "front",
    recommendedExercises: ["Military Press", "Dumbbell Shoulder Press", "Front Raises"],
  },
  {
    id: "side_delts",
    name: "Side Deltoids",
    description: "The lateral head of the deltoid, creating shoulder width.",
    function: "Shoulder abduction.",
    region: "upper_push",
    view: "front",
    recommendedExercises: ["Lateral Raises", "Cable Lateral Raises", "Arnold Press"],
  },
  {
    id: "rear_delts",
    name: "Rear Deltoids",
    description: "The posterior head of the deltoid at the back of the shoulder.",
    function: "Shoulder horizontal abduction and external rotation.",
    region: "upper_pull",
    view: "back",
    recommendedExercises: ["Rear-Delt Flyes", "Face Pulls", "Reverse Cable Flyes"],
  },
  {
    id: "biceps",
    name: "Biceps",
    description: "The biceps brachii with long and short heads on the front of the upper arm.",
    function: "Elbow flexion and forearm supination.",
    region: "upper_pull",
    view: "front",
    recommendedExercises: ["Dumbbell Curls", "Barbell Curls", "Chin-Ups"],
  },
  {
    id: "triceps",
    name: "Triceps",
    description: "The triceps brachii with three heads on the back of the upper arm.",
    function: "Elbow extension.",
    region: "upper_push",
    view: "back",
    recommendedExercises: ["Cable Triceps Pushdowns", "Skull Crushers", "Dips"],
  },
  {
    id: "forearms",
    name: "Forearms",
    description: "Multiple muscles of the forearm controlling wrist and finger movements.",
    function: "Wrist flexion, extension, and grip strength.",
    region: "upper_pull",
    view: "front",
    recommendedExercises: ["Hammer Curls", "Reverse Curls", "Farmer's Walks"],
  },
  {
    id: "lats",
    name: "Latissimus Dorsi",
    description: "The broadest muscle of the back, spanning from the lower spine to the upper arm.",
    function: "Shoulder adduction, extension, and internal rotation.",
    region: "upper_pull",
    view: "back",
    recommendedExercises: ["Pull-Ups", "Lat Pulldowns", "Bent-Over Rows"],
  },
  {
    id: "mid_back",
    name: "Mid-Back / Rhomboids",
    description: "The rhomboids major and minor between the spine and scapulae.",
    function: "Scapular retraction and downward rotation.",
    region: "upper_pull",
    view: "back",
    recommendedExercises: ["Cable Rows", "Chest-Supported Dumbbell Rows", "Face Pulls"],
  },
  {
    id: "lower_back",
    name: "Lower Back / Erectors",
    description: "The erector spinae group running along the lumbar spine.",
    function: "Spinal extension, lateral flexion, and postural support.",
    region: "upper_pull",
    view: "back",
    recommendedExercises: ["Deadlifts", "Good Mornings", "Back Extensions"],
  },
  {
    id: "traps",
    name: "Trapezius",
    description: "The large trapezoidal muscle spanning the neck, shoulders, and upper back.",
    function: "Scapular elevation, retraction, and depression.",
    region: "upper_pull",
    view: "back",
    recommendedExercises: ["Shrugs", "Face Pulls", "Rack Pulls"],
  },
  {
    id: "abs",
    name: "Rectus Abdominis",
    description: "The 'six-pack' muscle running vertically along the front of the abdomen.",
    function: "Trunk flexion and compression of abdominal contents.",
    region: "core",
    view: "front",
    recommendedExercises: ["Hanging Leg Raises", "Dragon Flags", "Hollow Holds"],
  },
  {
    id: "obliques",
    name: "Obliques / Serratus",
    description: "The internal and external obliques with the serratus anterior on the lateral torso.",
    function: "Trunk rotation, lateral flexion, and rib stabilization.",
    region: "core",
    view: "front",
    recommendedExercises: ["Woodchops", "Russian Twists", "Side Planks"],
  },
  {
    id: "glutes",
    name: "Glutes",
    description: "The gluteus maximus and medius forming the buttocks.",
    function: "Hip extension, abduction, and external rotation.",
    region: "lower_body",
    view: "back",
    recommendedExercises: ["Hip Thrusts", "Back Squats", "Bulgarian Split Squats"],
  },
  {
    id: "quads",
    name: "Quadriceps",
    description: "Four muscles on the front of the thigh including the vastus medialis teardrop.",
    function: "Knee extension and hip flexion.",
    region: "lower_body",
    view: "front",
    recommendedExercises: ["Back Squats", "Front Squats", "Leg Press"],
  },
  {
    id: "hamstrings",
    name: "Hamstrings",
    description: "Three muscles on the back of the thigh: biceps femoris, semitendinosus, semimembranosus.",
    function: "Knee flexion and hip extension.",
    region: "lower_body",
    view: "back",
    recommendedExercises: ["Romanian Deadlifts", "Nordic Hamstring Curls", "Leg Curls"],
  },
  {
    id: "adductors",
    name: "Adductors / Inner Thighs",
    description: "The adductor group on the inner thigh including adductor magnus, longus, and brevis.",
    function: "Hip adduction and stabilization.",
    region: "lower_body",
    view: "front",
    recommendedExercises: ["Sumo Squats", "Copenhagen Planks", "Cable Hip Adduction"],
  },
  {
    id: "calves",
    name: "Calves",
    description: "The gastrocnemius and soleus muscles of the lower leg with Achilles tendon.",
    function: "Ankle plantarflexion.",
    region: "lower_body",
    view: "back",
    recommendedExercises: ["Standing Calf Raises", "Seated Calf Raises", "Bodyweight Calf Raises"],
  },
];

export const MUSCLE_MAP = Object.fromEntries(MUSCLES.map((m) => [m.id, m]));

export const REGIONS = [
  { id: "upper_push" as const, name: "Upper Push", muscles: MUSCLES.filter((m) => m.region === "upper_push").map((m) => m.id) },
  { id: "upper_pull" as const, name: "Upper Pull", muscles: MUSCLES.filter((m) => m.region === "upper_pull").map((m) => m.id) },
  { id: "lower_body" as const, name: "Lower Body", muscles: MUSCLES.filter((m) => m.region === "lower_body").map((m) => m.id) },
  { id: "core" as const, name: "Core", muscles: MUSCLES.filter((m) => m.region === "core").map((m) => m.id) },
];

export type RegionId = "upper_push" | "upper_pull" | "lower_body" | "core";

export const RECOVERY_HOURS = 72;

export interface RecoveryState {
  muscleId: string;
  status: "just_trained" | "recovering" | "almost_ready" | "fully_recovered" | "not_trained";
  percentage: number;
  lastTrainedAt: Date | null;
  hoursRemaining: number;
  hoursSinceTraining: number;
  effectiveSets: number;
  lastWorkoutName: string | null;
}

export function getRecoveryStatus(hoursSinceTraining: number | null): RecoveryState["status"] {
  if (hoursSinceTraining === null) return "not_trained";
  if (hoursSinceTraining < 24) return "just_trained";
  if (hoursSinceTraining < 48) return "recovering";
  if (hoursSinceTraining < 72) return "almost_ready";
  return "fully_recovered";
}

export function getRecoveryPercentage(hoursSinceTraining: number | null): number {
  if (hoursSinceTraining === null) return 100;
  return Math.min(100, Math.round((hoursSinceTraining / RECOVERY_HOURS) * 100));
}

export function getRecoveryColor(status: RecoveryState["status"]): string {
  switch (status) {
    case "just_trained": return "#ef4444";
    case "recovering": return "#f59e0b";
    case "almost_ready": return "#22c55e";
    case "fully_recovered": return "#3b82f6";
    case "not_trained": return "#6b7280";
  }
}

export function getRecoveryBgClass(status: RecoveryState["status"]): string {
  switch (status) {
    case "just_trained": return "bg-red-500";
    case "recovering": return "bg-amber-500";
    case "almost_ready": return "bg-green-500";
    case "fully_recovered": return "bg-blue-500";
    case "not_trained": return "bg-gray-500";
  }
}

export function getRecoveryLabel(status: RecoveryState["status"]): string {
  switch (status) {
    case "just_trained": return "Just Trained";
    case "recovering": return "Recovering";
    case "almost_ready": return "Almost Ready";
    case "fully_recovered": return "Ready";
    case "not_trained": return "Not Trained";
  }
}

export function formatTimeRemaining(hours: number): string {
  if (hours <= 0) return "Ready";
  if (hours < 1) return `${Math.round(hours * 60)}m remaining`;
  if (hours < 24) return `${Math.round(hours)}h remaining`;
  return `${Math.round(hours / 24)}d ${Math.round(hours % 24)}h remaining`;
}

export function formatTimeSince(hours: number | null): string {
  if (hours === null) return "Never trained";
  if (hours < 1) return `${Math.round(hours * 60)}m ago`;
  if (hours < 24) return `${Math.round(hours)}h ago`;
  const days = Math.floor(hours / 24);
  const remainingHours = Math.round(hours % 24);
  return `${days}d ${remainingHours}h ago`;
}
