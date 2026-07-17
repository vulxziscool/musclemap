export interface ExerciseDefinition {
  name: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: string;
  category: string;
  defaultSets: number;
  defaultReps: number;
  defaultRest: number;
}

export const EXERCISE_LIBRARY: ExerciseDefinition[] = [
  // BODYWEIGHT & CALISTHENICS
  { name: "Push-Ups", primaryMuscle: "mid_chest", secondaryMuscles: ["front_delts", "triceps"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 15, defaultRest: 60 },
  { name: "Wide Push-Ups", primaryMuscle: "mid_chest", secondaryMuscles: ["front_delts", "triceps"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Archer Push-Ups", primaryMuscle: "mid_chest", secondaryMuscles: ["front_delts", "triceps"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 8, defaultRest: 90 },
  { name: "Incline Push-Ups", primaryMuscle: "lower_chest", secondaryMuscles: ["front_delts", "triceps"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 15, defaultRest: 60 },
  { name: "Decline Push-Ups", primaryMuscle: "upper_chest", secondaryMuscles: ["front_delts", "triceps"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Explosive Push-Ups", primaryMuscle: "mid_chest", secondaryMuscles: ["front_delts", "triceps"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 8, defaultRest: 90 },
  { name: "Dips", primaryMuscle: "lower_chest", secondaryMuscles: ["triceps", "front_delts"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Ring Dips", primaryMuscle: "lower_chest", secondaryMuscles: ["triceps", "front_delts"], equipment: "rings", category: "push", defaultSets: 3, defaultReps: 8, defaultRest: 120 },
  { name: "Pull-Ups", primaryMuscle: "lats", secondaryMuscles: ["biceps", "mid_back", "forearms"], equipment: "bodyweight", category: "pull", defaultSets: 3, defaultReps: 8, defaultRest: 120 },
  { name: "Chin-Ups", primaryMuscle: "biceps", secondaryMuscles: ["lats", "mid_back", "forearms"], equipment: "bodyweight", category: "pull", defaultSets: 3, defaultReps: 8, defaultRest: 120 },
  { name: "Archer Pull-Ups", primaryMuscle: "lats", secondaryMuscles: ["biceps", "mid_back"], equipment: "bodyweight", category: "pull", defaultSets: 3, defaultReps: 5, defaultRest: 120 },
  { name: "Commando Pull-Ups", primaryMuscle: "lats", secondaryMuscles: ["biceps", "mid_back", "forearms"], equipment: "bodyweight", category: "pull", defaultSets: 3, defaultReps: 6, defaultRest: 120 },
  { name: "Muscle-Ups", primaryMuscle: "lats", secondaryMuscles: ["mid_chest", "triceps", "biceps"], equipment: "bodyweight", category: "pull", defaultSets: 3, defaultReps: 3, defaultRest: 180 },
  { name: "Inverted Rows", primaryMuscle: "mid_back", secondaryMuscles: ["biceps", "rear_delts", "forearms"], equipment: "bodyweight", category: "pull", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Front Lever Progressions", primaryMuscle: "lats", secondaryMuscles: ["abs", "mid_back"], equipment: "bodyweight", category: "pull", defaultSets: 3, defaultReps: 5, defaultRest: 120 },
  { name: "Handstand Push-Ups", primaryMuscle: "front_delts", secondaryMuscles: ["triceps", "traps"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 5, defaultRest: 120 },
  { name: "Pike Push-Ups", primaryMuscle: "front_delts", secondaryMuscles: ["triceps", "upper_chest"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Wall Walks", primaryMuscle: "front_delts", secondaryMuscles: ["triceps", "abs", "traps"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 5, defaultRest: 120 },
  { name: "L-Sits", primaryMuscle: "abs", secondaryMuscles: ["quads", "obliques", "forearms"], equipment: "bodyweight", category: "core", defaultSets: 3, defaultReps: 15, defaultRest: 60 },
  { name: "Hanging Leg Raises", primaryMuscle: "abs", secondaryMuscles: ["obliques", "forearms"], equipment: "bodyweight", category: "core", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Dragon Flags", primaryMuscle: "abs", secondaryMuscles: ["obliques"], equipment: "bodyweight", category: "core", defaultSets: 3, defaultReps: 6, defaultRest: 90 },
  { name: "Hollow Holds", primaryMuscle: "abs", secondaryMuscles: ["obliques", "quads"], equipment: "bodyweight", category: "core", defaultSets: 3, defaultReps: 30, defaultRest: 60 },
  { name: "Human Flag Progressions", primaryMuscle: "obliques", secondaryMuscles: ["lats", "front_delts"], equipment: "bodyweight", category: "core", defaultSets: 3, defaultReps: 5, defaultRest: 120 },
  { name: "Pistol Squats", primaryMuscle: "quads", secondaryMuscles: ["glutes", "hamstrings", "calves"], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 5, defaultRest: 120 },
  { name: "Shrimp Squats", primaryMuscle: "quads", secondaryMuscles: ["glutes", "hamstrings"], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 6, defaultRest: 120 },
  { name: "Bulgarian Split Squats", primaryMuscle: "quads", secondaryMuscles: ["glutes", "hamstrings", "adductors"], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Nordic Hamstring Curls", primaryMuscle: "hamstrings", secondaryMuscles: ["glutes", "calves"], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 5, defaultRest: 120 },
  { name: "Bodyweight Calf Raises", primaryMuscle: "calves", secondaryMuscles: [], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 20, defaultRest: 45 },

  // DUMBBELLS
  { name: "Dumbbell Bench Press", primaryMuscle: "mid_chest", secondaryMuscles: ["front_delts", "triceps"], equipment: "dumbbell", category: "push", defaultSets: 4, defaultReps: 10, defaultRest: 90 },
  { name: "Incline Dumbbell Press", primaryMuscle: "upper_chest", secondaryMuscles: ["front_delts", "triceps"], equipment: "dumbbell", category: "push", defaultSets: 4, defaultReps: 10, defaultRest: 90 },
  { name: "Dumbbell Flyes", primaryMuscle: "mid_chest", secondaryMuscles: ["front_delts"], equipment: "dumbbell", category: "push", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Dumbbell Floor Press", primaryMuscle: "mid_chest", secondaryMuscles: ["triceps", "front_delts"], equipment: "dumbbell", category: "push", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Dumbbell Pullovers", primaryMuscle: "lats", secondaryMuscles: ["mid_chest", "triceps"], equipment: "dumbbell", category: "pull", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "One-Arm Dumbbell Rows", primaryMuscle: "lats", secondaryMuscles: ["biceps", "mid_back", "rear_delts"], equipment: "dumbbell", category: "pull", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Chest-Supported Dumbbell Rows", primaryMuscle: "mid_back", secondaryMuscles: ["biceps", "rear_delts", "lats"], equipment: "dumbbell", category: "pull", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Renegade Rows", primaryMuscle: "mid_back", secondaryMuscles: ["abs", "biceps", "lats"], equipment: "dumbbell", category: "pull", defaultSets: 3, defaultReps: 8, defaultRest: 90 },
  { name: "Dumbbell Shoulder Press", primaryMuscle: "front_delts", secondaryMuscles: ["triceps", "side_delts"], equipment: "dumbbell", category: "push", defaultSets: 4, defaultReps: 10, defaultRest: 90 },
  { name: "Arnold Press", primaryMuscle: "front_delts", secondaryMuscles: ["side_delts", "triceps"], equipment: "dumbbell", category: "push", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Front Raises", primaryMuscle: "front_delts", secondaryMuscles: ["side_delts"], equipment: "dumbbell", category: "push", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Lateral Raises", primaryMuscle: "side_delts", secondaryMuscles: ["front_delts", "traps"], equipment: "dumbbell", category: "push", defaultSets: 3, defaultReps: 15, defaultRest: 60 },
  { name: "Rear-Delt Flyes", primaryMuscle: "rear_delts", secondaryMuscles: ["mid_back", "traps"], equipment: "dumbbell", category: "pull", defaultSets: 3, defaultReps: 15, defaultRest: 60 },
  { name: "Dumbbell Curls", primaryMuscle: "biceps", secondaryMuscles: ["forearms"], equipment: "dumbbell", category: "pull", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Hammer Curls", primaryMuscle: "biceps", secondaryMuscles: ["forearms"], equipment: "dumbbell", category: "pull", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Concentration Curls", primaryMuscle: "biceps", secondaryMuscles: ["forearms"], equipment: "dumbbell", category: "pull", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Triceps Extensions", primaryMuscle: "triceps", secondaryMuscles: [], equipment: "dumbbell", category: "push", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Dumbbell Skull Crushers", primaryMuscle: "triceps", secondaryMuscles: [], equipment: "dumbbell", category: "push", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Goblet Squats", primaryMuscle: "quads", secondaryMuscles: ["glutes", "adductors"], equipment: "dumbbell", category: "legs", defaultSets: 3, defaultReps: 12, defaultRest: 90 },
  { name: "Dumbbell Lunges", primaryMuscle: "quads", secondaryMuscles: ["glutes", "hamstrings"], equipment: "dumbbell", category: "legs", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Dumbbell Romanian Deadlifts", primaryMuscle: "hamstrings", secondaryMuscles: ["glutes", "lower_back"], equipment: "dumbbell", category: "legs", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Dumbbell Hip Thrusts", primaryMuscle: "glutes", secondaryMuscles: ["hamstrings"], equipment: "dumbbell", category: "legs", defaultSets: 3, defaultReps: 12, defaultRest: 90 },
  { name: "Weighted Calf Raises", primaryMuscle: "calves", secondaryMuscles: [], equipment: "dumbbell", category: "legs", defaultSets: 3, defaultReps: 15, defaultRest: 45 },

  // BARBELL
  { name: "Bench Press", primaryMuscle: "mid_chest", secondaryMuscles: ["front_delts", "triceps"], equipment: "barbell", category: "push", defaultSets: 4, defaultReps: 8, defaultRest: 120 },
  { name: "Incline Bench Press", primaryMuscle: "upper_chest", secondaryMuscles: ["front_delts", "triceps"], equipment: "barbell", category: "push", defaultSets: 4, defaultReps: 8, defaultRest: 120 },
  { name: "Decline Bench Press", primaryMuscle: "lower_chest", secondaryMuscles: ["triceps", "front_delts"], equipment: "barbell", category: "push", defaultSets: 4, defaultReps: 8, defaultRest: 120 },
  { name: "Back Squats", primaryMuscle: "quads", secondaryMuscles: ["glutes", "hamstrings", "lower_back", "adductors"], equipment: "barbell", category: "legs", defaultSets: 4, defaultReps: 8, defaultRest: 150 },
  { name: "Front Squats", primaryMuscle: "quads", secondaryMuscles: ["glutes", "abs", "upper_chest"], equipment: "barbell", category: "legs", defaultSets: 4, defaultReps: 8, defaultRest: 150 },
  { name: "Deadlifts", primaryMuscle: "lower_back", secondaryMuscles: ["glutes", "hamstrings", "quads", "forearms", "traps"], equipment: "barbell", category: "pull", defaultSets: 4, defaultReps: 5, defaultRest: 180 },
  { name: "Romanian Deadlifts", primaryMuscle: "hamstrings", secondaryMuscles: ["glutes", "lower_back"], equipment: "barbell", category: "legs", defaultSets: 4, defaultReps: 10, defaultRest: 120 },
  { name: "Bent-Over Rows", primaryMuscle: "mid_back", secondaryMuscles: ["lats", "biceps", "rear_delts"], equipment: "barbell", category: "pull", defaultSets: 4, defaultReps: 8, defaultRest: 120 },
  { name: "Pendlay Rows", primaryMuscle: "mid_back", secondaryMuscles: ["lats", "biceps", "lower_back"], equipment: "barbell", category: "pull", defaultSets: 4, defaultReps: 8, defaultRest: 120 },
  { name: "Landmine Rows", primaryMuscle: "lats", secondaryMuscles: ["mid_back", "biceps", "rear_delts"], equipment: "barbell", category: "pull", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Military Press", primaryMuscle: "front_delts", secondaryMuscles: ["triceps", "side_delts", "traps"], equipment: "barbell", category: "push", defaultSets: 4, defaultReps: 8, defaultRest: 120 },
  { name: "Push Press", primaryMuscle: "front_delts", secondaryMuscles: ["triceps", "side_delts", "quads"], equipment: "barbell", category: "push", defaultSets: 4, defaultReps: 6, defaultRest: 120 },
  { name: "Barbell Curls", primaryMuscle: "biceps", secondaryMuscles: ["forearms"], equipment: "barbell", category: "pull", defaultSets: 3, defaultReps: 10, defaultRest: 60 },
  { name: "Skull Crushers", primaryMuscle: "triceps", secondaryMuscles: [], equipment: "barbell", category: "push", defaultSets: 3, defaultReps: 10, defaultRest: 60 },
  { name: "Hip Thrusts", primaryMuscle: "glutes", secondaryMuscles: ["hamstrings", "adductors"], equipment: "barbell", category: "legs", defaultSets: 4, defaultReps: 10, defaultRest: 120 },
  { name: "Good Mornings", primaryMuscle: "lower_back", secondaryMuscles: ["hamstrings", "glutes"], equipment: "barbell", category: "pull", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Shrugs", primaryMuscle: "traps", secondaryMuscles: ["forearms"], equipment: "barbell", category: "pull", defaultSets: 3, defaultReps: 12, defaultRest: 60 },

  // KETTLEBELLS
  { name: "Kettlebell Swings", primaryMuscle: "glutes", secondaryMuscles: ["hamstrings", "lower_back", "abs"], equipment: "kettlebell", category: "legs", defaultSets: 3, defaultReps: 15, defaultRest: 60 },
  { name: "Kettlebell Goblet Squats", primaryMuscle: "quads", secondaryMuscles: ["glutes", "adductors"], equipment: "kettlebell", category: "legs", defaultSets: 3, defaultReps: 12, defaultRest: 90 },
  { name: "Clean and Press", primaryMuscle: "front_delts", secondaryMuscles: ["triceps", "traps", "quads"], equipment: "kettlebell", category: "push", defaultSets: 3, defaultReps: 8, defaultRest: 90 },
  { name: "Kettlebell High Pulls", primaryMuscle: "traps", secondaryMuscles: ["rear_delts", "biceps"], equipment: "kettlebell", category: "pull", defaultSets: 3, defaultReps: 10, defaultRest: 60 },
  { name: "Kettlebell Romanian Deadlifts", primaryMuscle: "hamstrings", secondaryMuscles: ["glutes", "lower_back"], equipment: "kettlebell", category: "legs", defaultSets: 3, defaultReps: 10, defaultRest: 90 },

  // CABLES
  { name: "Cable Crossovers", primaryMuscle: "mid_chest", secondaryMuscles: ["front_delts"], equipment: "cable", category: "push", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Low-to-High Cable Flyes", primaryMuscle: "upper_chest", secondaryMuscles: ["front_delts"], equipment: "cable", category: "push", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "High-to-Low Cable Flyes", primaryMuscle: "lower_chest", secondaryMuscles: ["front_delts"], equipment: "cable", category: "push", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Lat Pulldowns", primaryMuscle: "lats", secondaryMuscles: ["biceps", "mid_back", "forearms"], equipment: "cable", category: "pull", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Cable Rows", primaryMuscle: "mid_back", secondaryMuscles: ["lats", "biceps", "rear_delts"], equipment: "cable", category: "pull", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Straight-Arm Pulldowns", primaryMuscle: "lats", secondaryMuscles: ["abs", "triceps"], equipment: "cable", category: "pull", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Cable Lateral Raises", primaryMuscle: "side_delts", secondaryMuscles: ["front_delts", "traps"], equipment: "cable", category: "push", defaultSets: 3, defaultReps: 15, defaultRest: 60 },
  { name: "Face Pulls", primaryMuscle: "rear_delts", secondaryMuscles: ["mid_back", "traps"], equipment: "cable", category: "pull", defaultSets: 3, defaultReps: 15, defaultRest: 60 },
  { name: "Cable Curls", primaryMuscle: "biceps", secondaryMuscles: ["forearms"], equipment: "cable", category: "pull", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Cable Triceps Pushdowns", primaryMuscle: "triceps", secondaryMuscles: [], equipment: "cable", category: "push", defaultSets: 3, defaultReps: 12, defaultRest: 60 },

  // MORE BODYWEIGHT
  { name: "Reverse Curls", primaryMuscle: "forearms", secondaryMuscles: ["biceps"], equipment: "barbell", category: "pull", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Farmer's Walks", primaryMuscle: "forearms", secondaryMuscles: ["traps", "abs"], equipment: "dumbbell", category: "pull", defaultSets: 3, defaultReps: 30, defaultRest: 90 },
  { name: "Woodchops", primaryMuscle: "obliques", secondaryMuscles: ["abs"], equipment: "cable", category: "core", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Russian Twists", primaryMuscle: "obliques", secondaryMuscles: ["abs"], equipment: "bodyweight", category: "core", defaultSets: 3, defaultReps: 20, defaultRest: 60 },
  { name: "Side Planks", primaryMuscle: "obliques", secondaryMuscles: ["abs", "glutes"], equipment: "bodyweight", category: "core", defaultSets: 3, defaultReps: 30, defaultRest: 60 },
  { name: "Sumo Squats", primaryMuscle: "adductors", secondaryMuscles: ["quads", "glutes"], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 15, defaultRest: 60 },
  { name: "Copenhagen Planks", primaryMuscle: "adductors", secondaryMuscles: ["obliques", "abs"], equipment: "bodyweight", category: "core", defaultSets: 3, defaultReps: 15, defaultRest: 60 },
  { name: "Cable Hip Adduction", primaryMuscle: "adductors", secondaryMuscles: [], equipment: "cable", category: "legs", defaultSets: 3, defaultReps: 15, defaultRest: 60 },
  { name: "Standing Calf Raises", primaryMuscle: "calves", secondaryMuscles: [], equipment: "machine", category: "legs", defaultSets: 4, defaultReps: 15, defaultRest: 45 },
  { name: "Seated Calf Raises", primaryMuscle: "calves", secondaryMuscles: [], equipment: "machine", category: "legs", defaultSets: 4, defaultReps: 15, defaultRest: 45 },
  { name: "Back Extensions", primaryMuscle: "lower_back", secondaryMuscles: ["glutes", "hamstrings"], equipment: "bodyweight", category: "pull", defaultSets: 3, defaultReps: 15, defaultRest: 60 },
  { name: "Rack Pulls", primaryMuscle: "traps", secondaryMuscles: ["lower_back", "forearms", "glutes"], equipment: "barbell", category: "pull", defaultSets: 3, defaultReps: 6, defaultRest: 120 },
  { name: "Reverse Cable Flyes", primaryMuscle: "rear_delts", secondaryMuscles: ["mid_back", "traps"], equipment: "cable", category: "pull", defaultSets: 3, defaultReps: 15, defaultRest: 60 },
  { name: "Leg Press", primaryMuscle: "quads", secondaryMuscles: ["glutes", "hamstrings"], equipment: "machine", category: "legs", defaultSets: 4, defaultReps: 10, defaultRest: 120 },
  { name: "Leg Curls", primaryMuscle: "hamstrings", secondaryMuscles: ["calves"], equipment: "machine", category: "legs", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Sumo Deadlifts", primaryMuscle: "glutes", secondaryMuscles: ["quads", "hamstrings", "adductors", "lower_back"], equipment: "barbell", category: "legs", defaultSets: 4, defaultReps: 6, defaultRest: 150 },
  { name: "Reverse Lunges", primaryMuscle: "quads", secondaryMuscles: ["glutes", "hamstrings"], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Step-Ups", primaryMuscle: "quads", secondaryMuscles: ["glutes", "calves"], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 10, defaultRest: 60 },
  { name: "Plank", primaryMuscle: "abs", secondaryMuscles: ["obliques"], equipment: "bodyweight", category: "core", defaultSets: 3, defaultReps: 60, defaultRest: 60 },
  { name: "Ab Wheel Rollouts", primaryMuscle: "abs", secondaryMuscles: ["obliques", "lats"], equipment: "bodyweight", category: "core", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Cable Crunches", primaryMuscle: "abs", secondaryMuscles: ["obliques"], equipment: "cable", category: "core", defaultSets: 3, defaultReps: 15, defaultRest: 60 },
  { name: "Bicycle Crunches", primaryMuscle: "obliques", secondaryMuscles: ["abs"], equipment: "bodyweight", category: "core", defaultSets: 3, defaultReps: 20, defaultRest: 60 },
  { name: "Mountain Climbers", primaryMuscle: "abs", secondaryMuscles: ["obliques", "quads", "front_delts"], equipment: "bodyweight", category: "core", defaultSets: 3, defaultReps: 20, defaultRest: 60 },
  { name: "Pallof Press", primaryMuscle: "obliques", secondaryMuscles: ["abs"], equipment: "cable", category: "core", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Overhead Triceps Extension", primaryMuscle: "triceps", secondaryMuscles: [], equipment: "cable", category: "push", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Diamond Push-Ups", primaryMuscle: "triceps", secondaryMuscles: ["mid_chest", "front_delts"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Preacher Curls", primaryMuscle: "biceps", secondaryMuscles: ["forearms"], equipment: "barbell", category: "pull", defaultSets: 3, defaultReps: 10, defaultRest: 60 },
  { name: "Incline Dumbbell Curls", primaryMuscle: "biceps", secondaryMuscles: ["forearms"], equipment: "dumbbell", category: "pull", defaultSets: 3, defaultReps: 10, defaultRest: 60 },
  { name: "Wrist Curls", primaryMuscle: "forearms", secondaryMuscles: [], equipment: "dumbbell", category: "pull", defaultSets: 3, defaultReps: 15, defaultRest: 45 },
  { name: "T-Bar Rows", primaryMuscle: "mid_back", secondaryMuscles: ["lats", "biceps", "rear_delts"], equipment: "barbell", category: "pull", defaultSets: 4, defaultReps: 10, defaultRest: 90 },
  { name: "Dumbbell Shrugs", primaryMuscle: "traps", secondaryMuscles: ["forearms"], equipment: "dumbbell", category: "pull", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Upright Rows", primaryMuscle: "traps", secondaryMuscles: ["side_delts", "front_delts"], equipment: "barbell", category: "pull", defaultSets: 3, defaultReps: 10, defaultRest: 60 },
  { name: "Close-Grip Bench Press", primaryMuscle: "triceps", secondaryMuscles: ["mid_chest", "front_delts"], equipment: "barbell", category: "push", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Glute Bridges", primaryMuscle: "glutes", secondaryMuscles: ["hamstrings"], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 15, defaultRest: 60 },
  { name: "Box Jumps", primaryMuscle: "quads", secondaryMuscles: ["glutes", "calves", "hamstrings"], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 8, defaultRest: 90 },
  { name: "Walking Lunges", primaryMuscle: "quads", secondaryMuscles: ["glutes", "hamstrings"], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Single-Leg Romanian Deadlifts", primaryMuscle: "hamstrings", secondaryMuscles: ["glutes", "lower_back"], equipment: "dumbbell", category: "legs", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Glute-Ham Raises", primaryMuscle: "hamstrings", secondaryMuscles: ["glutes", "lower_back"], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 8, defaultRest: 90 },
  { name: "Cossack Squats", primaryMuscle: "adductors", secondaryMuscles: ["quads", "glutes"], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 8, defaultRest: 90 },
  { name: "Donkey Calf Raises", primaryMuscle: "calves", secondaryMuscles: [], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 15, defaultRest: 45 },
  { name: "Jump Rope", primaryMuscle: "calves", secondaryMuscles: ["quads", "forearms"], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 60, defaultRest: 60 },
  // BODYWEIGHT EXTRAS
  { name: "Bench Dips", primaryMuscle: "triceps", secondaryMuscles: ["lower_chest", "front_delts"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 15, defaultRest: 60 },
  { name: "Pseudo Planche Push-Ups", primaryMuscle: "front_delts", secondaryMuscles: ["mid_chest", "triceps"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 8, defaultRest: 90 },
  { name: "Typewriter Push-Ups", primaryMuscle: "mid_chest", secondaryMuscles: ["triceps", "front_delts"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 6, defaultRest: 90 },
  { name: "Clap Push-Ups", primaryMuscle: "mid_chest", secondaryMuscles: ["triceps", "front_delts"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 8, defaultRest: 90 },
  { name: "Hindu Push-Ups", primaryMuscle: "mid_chest", secondaryMuscles: ["front_delts", "triceps", "abs"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Spiderman Push-Ups", primaryMuscle: "mid_chest", secondaryMuscles: ["obliques", "triceps"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 10, defaultRest: 60 },
  { name: "Staggered Push-Ups", primaryMuscle: "mid_chest", secondaryMuscles: ["triceps", "front_delts"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 10, defaultRest: 60 },
  { name: "One-Arm Push-Ups", primaryMuscle: "mid_chest", secondaryMuscles: ["triceps", "front_delts", "abs"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 3, defaultRest: 120 },
  { name: "Deficit Push-Ups", primaryMuscle: "mid_chest", secondaryMuscles: ["front_delts", "triceps"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Australian Pull-Ups", primaryMuscle: "mid_back", secondaryMuscles: ["biceps", "rear_delts"], equipment: "bodyweight", category: "pull", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Wide-Grip Pull-Ups", primaryMuscle: "lats", secondaryMuscles: ["biceps", "mid_back"], equipment: "bodyweight", category: "pull", defaultSets: 3, defaultReps: 6, defaultRest: 120 },
  { name: "Close-Grip Chin-Ups", primaryMuscle: "biceps", secondaryMuscles: ["lats", "forearms"], equipment: "bodyweight", category: "pull", defaultSets: 3, defaultReps: 8, defaultRest: 90 },
  { name: "Towel Pull-Ups", primaryMuscle: "lats", secondaryMuscles: ["biceps", "forearms"], equipment: "bodyweight", category: "pull", defaultSets: 3, defaultReps: 5, defaultRest: 120 },
  { name: "Negative Pull-Ups", primaryMuscle: "lats", secondaryMuscles: ["biceps", "mid_back"], equipment: "bodyweight", category: "pull", defaultSets: 3, defaultReps: 5, defaultRest: 120 },
  { name: "Tuck Front Lever", primaryMuscle: "lats", secondaryMuscles: ["abs", "mid_back"], equipment: "bodyweight", category: "pull", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Skin the Cat", primaryMuscle: "lats", secondaryMuscles: ["front_delts", "abs"], equipment: "bodyweight", category: "pull", defaultSets: 3, defaultReps: 5, defaultRest: 120 },
  { name: "Bear Crawls", primaryMuscle: "abs", secondaryMuscles: ["front_delts", "quads"], equipment: "bodyweight", category: "core", defaultSets: 3, defaultReps: 20, defaultRest: 60 },
  { name: "Crab Walks", primaryMuscle: "triceps", secondaryMuscles: ["glutes", "front_delts"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 20, defaultRest: 60 },
  { name: "Inchworms", primaryMuscle: "abs", secondaryMuscles: ["front_delts", "hamstrings"], equipment: "bodyweight", category: "core", defaultSets: 3, defaultReps: 8, defaultRest: 60 },
  { name: "Wall Sit", primaryMuscle: "quads", secondaryMuscles: ["glutes"], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 45, defaultRest: 60 },
  { name: "Jump Squats", primaryMuscle: "quads", secondaryMuscles: ["glutes", "calves"], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Split Jumps", primaryMuscle: "quads", secondaryMuscles: ["glutes", "hamstrings"], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 10, defaultRest: 60 },
  { name: "Single-Leg Glute Bridge", primaryMuscle: "glutes", secondaryMuscles: ["hamstrings"], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Donkey Kicks", primaryMuscle: "glutes", secondaryMuscles: ["hamstrings"], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 15, defaultRest: 45 },
  { name: "Fire Hydrants", primaryMuscle: "glutes", secondaryMuscles: ["adductors"], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 15, defaultRest: 45 },
  { name: "Superman Hold", primaryMuscle: "lower_back", secondaryMuscles: ["glutes"], equipment: "bodyweight", category: "core", defaultSets: 3, defaultReps: 15, defaultRest: 45 },
  { name: "Reverse Plank", primaryMuscle: "lower_back", secondaryMuscles: ["glutes", "triceps"], equipment: "bodyweight", category: "core", defaultSets: 3, defaultReps: 30, defaultRest: 60 },
  { name: "Tuck Planche", primaryMuscle: "front_delts", secondaryMuscles: ["triceps", "abs"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 10, defaultRest: 120 },
  { name: "Back Lever", primaryMuscle: "lats", secondaryMuscles: ["biceps", "abs"], equipment: "bodyweight", category: "pull", defaultSets: 3, defaultReps: 10, defaultRest: 120 },
  { name: "Burpee Pull-Ups", primaryMuscle: "lats", secondaryMuscles: ["mid_chest", "quads", "abs"], equipment: "bodyweight", category: "pull", defaultSets: 3, defaultReps: 5, defaultRest: 120 },
  { name: "Bodyweight Skull Crushers", primaryMuscle: "triceps", secondaryMuscles: ["front_delts"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 10, defaultRest: 60 },
  // MORE CHEST
  { name: "Svend Press", primaryMuscle: "mid_chest", secondaryMuscles: ["front_delts"], equipment: "dumbbell", category: "push", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Hex Press", primaryMuscle: "mid_chest", secondaryMuscles: ["triceps"], equipment: "dumbbell", category: "push", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Landmine Press", primaryMuscle: "upper_chest", secondaryMuscles: ["front_delts", "triceps"], equipment: "barbell", category: "push", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Machine Chest Press", primaryMuscle: "mid_chest", secondaryMuscles: ["front_delts", "triceps"], equipment: "machine", category: "push", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Pec Deck Machine", primaryMuscle: "mid_chest", secondaryMuscles: ["front_delts"], equipment: "machine", category: "push", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  // MORE BACK
  { name: "Meadows Rows", primaryMuscle: "lats", secondaryMuscles: ["mid_back", "biceps"], equipment: "barbell", category: "pull", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Seal Rows", primaryMuscle: "mid_back", secondaryMuscles: ["lats", "biceps"], equipment: "dumbbell", category: "pull", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Kroc Rows", primaryMuscle: "lats", secondaryMuscles: ["mid_back", "biceps", "forearms"], equipment: "dumbbell", category: "pull", defaultSets: 3, defaultReps: 15, defaultRest: 90 },
  { name: "Machine Lat Pulldown", primaryMuscle: "lats", secondaryMuscles: ["biceps"], equipment: "machine", category: "pull", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Machine Seated Row", primaryMuscle: "mid_back", secondaryMuscles: ["lats", "biceps"], equipment: "machine", category: "pull", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Snatch-Grip Deadlifts", primaryMuscle: "lower_back", secondaryMuscles: ["traps", "hamstrings", "glutes"], equipment: "barbell", category: "pull", defaultSets: 3, defaultReps: 6, defaultRest: 150 },
  { name: "Deficit Deadlifts", primaryMuscle: "lower_back", secondaryMuscles: ["glutes", "hamstrings", "quads"], equipment: "barbell", category: "pull", defaultSets: 3, defaultReps: 5, defaultRest: 180 },
  // MORE SHOULDERS
  { name: "Lu Raises", primaryMuscle: "side_delts", secondaryMuscles: ["front_delts"], equipment: "dumbbell", category: "push", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Seated Dumbbell Press", primaryMuscle: "front_delts", secondaryMuscles: ["triceps", "side_delts"], equipment: "dumbbell", category: "push", defaultSets: 4, defaultReps: 10, defaultRest: 90 },
  { name: "Behind-the-Neck Press", primaryMuscle: "front_delts", secondaryMuscles: ["side_delts", "triceps"], equipment: "barbell", category: "push", defaultSets: 3, defaultReps: 8, defaultRest: 120 },
  { name: "Machine Shoulder Press", primaryMuscle: "front_delts", secondaryMuscles: ["triceps"], equipment: "machine", category: "push", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Cable Front Raises", primaryMuscle: "front_delts", secondaryMuscles: ["side_delts"], equipment: "cable", category: "push", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Band Pull-Aparts", primaryMuscle: "rear_delts", secondaryMuscles: ["mid_back"], equipment: "bodyweight", category: "pull", defaultSets: 3, defaultReps: 20, defaultRest: 45 },
  // MORE ARMS
  { name: "Spider Curls", primaryMuscle: "biceps", secondaryMuscles: ["forearms"], equipment: "dumbbell", category: "pull", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "EZ Bar Curls", primaryMuscle: "biceps", secondaryMuscles: ["forearms"], equipment: "barbell", category: "pull", defaultSets: 3, defaultReps: 10, defaultRest: 60 },
  { name: "Cable Hammer Curls", primaryMuscle: "biceps", secondaryMuscles: ["forearms"], equipment: "cable", category: "pull", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Bayesian Curls", primaryMuscle: "biceps", secondaryMuscles: ["forearms"], equipment: "cable", category: "pull", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Tricep Dips (bench)", primaryMuscle: "triceps", secondaryMuscles: ["front_delts"], equipment: "bodyweight", category: "push", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "JM Press", primaryMuscle: "triceps", secondaryMuscles: ["mid_chest"], equipment: "barbell", category: "push", defaultSets: 3, defaultReps: 8, defaultRest: 90 },
  { name: "Tricep Kickbacks", primaryMuscle: "triceps", secondaryMuscles: [], equipment: "dumbbell", category: "push", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Wrist Rollers", primaryMuscle: "forearms", secondaryMuscles: [], equipment: "bodyweight", category: "pull", defaultSets: 3, defaultReps: 10, defaultRest: 60 },
  { name: "Dead Hangs", primaryMuscle: "forearms", secondaryMuscles: ["lats"], equipment: "bodyweight", category: "pull", defaultSets: 3, defaultReps: 30, defaultRest: 60 },
  // MORE LEGS
  { name: "Hack Squats", primaryMuscle: "quads", secondaryMuscles: ["glutes"], equipment: "machine", category: "legs", defaultSets: 4, defaultReps: 10, defaultRest: 120 },
  { name: "Pendulum Squats", primaryMuscle: "quads", secondaryMuscles: ["glutes"], equipment: "machine", category: "legs", defaultSets: 3, defaultReps: 12, defaultRest: 90 },
  { name: "Sissy Squats", primaryMuscle: "quads", secondaryMuscles: [], equipment: "bodyweight", category: "legs", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Leg Extensions", primaryMuscle: "quads", secondaryMuscles: [], equipment: "machine", category: "legs", defaultSets: 3, defaultReps: 15, defaultRest: 60 },
  { name: "Belt Squats", primaryMuscle: "quads", secondaryMuscles: ["glutes", "adductors"], equipment: "machine", category: "legs", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Zercher Squats", primaryMuscle: "quads", secondaryMuscles: ["glutes", "abs", "biceps"], equipment: "barbell", category: "legs", defaultSets: 3, defaultReps: 8, defaultRest: 120 },
  { name: "Pause Squats", primaryMuscle: "quads", secondaryMuscles: ["glutes", "lower_back"], equipment: "barbell", category: "legs", defaultSets: 3, defaultReps: 5, defaultRest: 150 },
  { name: "Lying Leg Curls", primaryMuscle: "hamstrings", secondaryMuscles: [], equipment: "machine", category: "legs", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Seated Leg Curls", primaryMuscle: "hamstrings", secondaryMuscles: [], equipment: "machine", category: "legs", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Good Girl Machine", primaryMuscle: "adductors", secondaryMuscles: [], equipment: "machine", category: "legs", defaultSets: 3, defaultReps: 15, defaultRest: 45 },
  { name: "Bad Girl Machine", primaryMuscle: "glutes", secondaryMuscles: [], equipment: "machine", category: "legs", defaultSets: 3, defaultReps: 15, defaultRest: 45 },
  { name: "Cable Pull-Throughs", primaryMuscle: "glutes", secondaryMuscles: ["hamstrings"], equipment: "cable", category: "legs", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Reverse Hypers", primaryMuscle: "glutes", secondaryMuscles: ["hamstrings", "lower_back"], equipment: "machine", category: "legs", defaultSets: 3, defaultReps: 12, defaultRest: 60 },
  { name: "Smith Machine Squats", primaryMuscle: "quads", secondaryMuscles: ["glutes"], equipment: "machine", category: "legs", defaultSets: 3, defaultReps: 10, defaultRest: 90 },
  { name: "Trap Bar Deadlifts", primaryMuscle: "quads", secondaryMuscles: ["glutes", "hamstrings", "lower_back", "traps"], equipment: "barbell", category: "legs", defaultSets: 4, defaultReps: 6, defaultRest: 150 },
  // MORE CORE
  { name: "V-Ups", primaryMuscle: "abs", secondaryMuscles: ["obliques"], equipment: "bodyweight", category: "core", defaultSets: 3, defaultReps: 15, defaultRest: 60 },
  { name: "Toe Touches", primaryMuscle: "abs", secondaryMuscles: [], equipment: "bodyweight", category: "core", defaultSets: 3, defaultReps: 15, defaultRest: 45 },
  { name: "Dead Bugs", primaryMuscle: "abs", secondaryMuscles: ["obliques"], equipment: "bodyweight", category: "core", defaultSets: 3, defaultReps: 12, defaultRest: 45 },
  { name: "Flutter Kicks", primaryMuscle: "abs", secondaryMuscles: ["quads"], equipment: "bodyweight", category: "core", defaultSets: 3, defaultReps: 20, defaultRest: 45 },
  { name: "Weighted Crunches", primaryMuscle: "abs", secondaryMuscles: [], equipment: "dumbbell", category: "core", defaultSets: 3, defaultReps: 15, defaultRest: 60 },
  { name: "Landmine Rotations", primaryMuscle: "obliques", secondaryMuscles: ["abs"], equipment: "barbell", category: "core", defaultSets: 3, defaultReps: 10, defaultRest: 60 },
  { name: "Suitcase Carries", primaryMuscle: "obliques", secondaryMuscles: ["forearms", "traps"], equipment: "dumbbell", category: "core", defaultSets: 3, defaultReps: 30, defaultRest: 90 },
];

export const EXERCISE_MAP = Object.fromEntries(EXERCISE_LIBRARY.map((e) => [e.name, e]));

// ─── Strength Standards (multiplier of bodyweight) ───
// [beginner, novice, intermediate, advanced, elite]
export const STRENGTH_STANDARDS: Record<string, { male: number[]; female: number[] }> = {
  "Bench Press":       { male: [0.50, 0.75, 1.00, 1.50, 2.00], female: [0.25, 0.40, 0.60, 1.00, 1.25] },
  "Incline Bench Press":{ male: [0.40, 0.65, 0.85, 1.25, 1.70], female: [0.20, 0.35, 0.55, 0.85, 1.10] },
  "Back Squats":       { male: [0.60, 1.00, 1.40, 2.00, 2.50], female: [0.35, 0.60, 0.90, 1.40, 1.80] },
  "Front Squats":      { male: [0.50, 0.85, 1.20, 1.70, 2.10], female: [0.30, 0.50, 0.75, 1.20, 1.50] },
  "Deadlifts":         { male: [0.75, 1.25, 1.75, 2.50, 3.00], female: [0.45, 0.75, 1.10, 1.75, 2.25] },
  "Romanian Deadlifts": { male: [0.50, 0.85, 1.20, 1.75, 2.25], female: [0.30, 0.55, 0.85, 1.30, 1.70] },
  "Military Press":    { male: [0.35, 0.55, 0.75, 1.10, 1.40], female: [0.20, 0.30, 0.45, 0.70, 0.90] },
  "Barbell Curls":     { male: [0.25, 0.40, 0.55, 0.75, 1.00], female: [0.15, 0.25, 0.35, 0.50, 0.65] },
  "Bent-Over Rows":    { male: [0.45, 0.70, 1.00, 1.40, 1.80], female: [0.25, 0.45, 0.65, 1.00, 1.30] },
  "Hip Thrusts":       { male: [0.60, 1.00, 1.50, 2.00, 2.75], female: [0.50, 0.80, 1.25, 1.75, 2.25] },
  "Dumbbell Bench Press": { male: [0.20, 0.35, 0.50, 0.70, 0.90], female: [0.10, 0.20, 0.30, 0.50, 0.60] },
  "Dumbbell Shoulder Press": { male: [0.15, 0.30, 0.40, 0.60, 0.75], female: [0.08, 0.15, 0.25, 0.40, 0.50] },
  "Dumbbell Curls":    { male: [0.10, 0.18, 0.25, 0.35, 0.45], female: [0.05, 0.10, 0.18, 0.25, 0.30] },
  "Skull Crushers":    { male: [0.20, 0.35, 0.50, 0.70, 0.85], female: [0.10, 0.20, 0.30, 0.45, 0.55] },
  "Shrugs":            { male: [0.60, 1.00, 1.50, 2.00, 2.75], female: [0.35, 0.60, 1.00, 1.40, 1.80] },
  "Lat Pulldowns":     { male: [0.40, 0.60, 0.85, 1.20, 1.50], female: [0.25, 0.40, 0.60, 0.85, 1.10] },
  "Cable Rows":        { male: [0.40, 0.60, 0.85, 1.15, 1.50], female: [0.25, 0.40, 0.55, 0.80, 1.05] },
  "Trap Bar Deadlifts": { male: [0.80, 1.30, 1.85, 2.60, 3.20], female: [0.50, 0.80, 1.20, 1.85, 2.40] },
  "Hack Squats":       { male: [0.50, 0.85, 1.20, 1.70, 2.10], female: [0.30, 0.55, 0.80, 1.20, 1.50] },
  "Leg Press":         { male: [1.00, 1.50, 2.50, 3.50, 4.50], female: [0.70, 1.10, 1.80, 2.50, 3.20] },
};

export const RANK_LABELS = ["Beginner", "Novice", "Intermediate", "Advanced", "Elite"];
export const RANK_COLORS = ["#64748b", "#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

export function getRank(exerciseName: string, weightLifted: number, bodyWeight: number, gender: string): { rank: number; label: string; color: string; ratio: number; nextThreshold: number | null } {
  const standards = STRENGTH_STANDARDS[exerciseName];
  const ratio = bodyWeight > 0 ? weightLifted / bodyWeight : 0;
  if (!standards) {
    // Generic fallback
    const i = ratio < 0.3 ? 0 : ratio < 0.6 ? 1 : ratio < 1.0 ? 2 : ratio < 1.5 ? 3 : 4;
    return { rank: i, label: RANK_LABELS[i], color: RANK_COLORS[i], ratio, nextThreshold: i < 4 ? [0.3,0.6,1.0,1.5,999][i+1] * bodyWeight : null };
  }
  const thresholds = gender === "female" ? standards.female : standards.male;
  let rank = 0;
  for (let i = 0; i < thresholds.length; i++) { if (ratio >= thresholds[i]) rank = i; }
  const nextThreshold = rank < 4 ? thresholds[rank + 1] * bodyWeight : null;
  return { rank, label: RANK_LABELS[rank], color: RANK_COLORS[rank], ratio, nextThreshold };
}
