# MuscleMap — Recovery-Aware Training Tracker

A full-stack fitness tracking app with anatomical muscle visualization, recovery tracking, weight/strength progress charts, and mobile-first design.

## Features

- 🏋️ **Workout Logging** — Log exercises with sets, reps, weight, and rest times
- 🧬 **Anatomical Body Map** — Interactive front/back muscle visualization
- 📊 **Recovery Tracking** — 72-hour recovery window with status indicators
- 📈 **Progress Charts** — Body weight, body fat %, and strength tracking
- 📱 **Mobile PWA** — Add to home screen for app-like experience
- ⌚ **Apple Watch Ready** — Architecture prepared for wearable integration

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Glassmorphism design system

## Deploy to Vercel (Free)

### 1. Get a Free Database

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy your connection string

### 2. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/musclemap)

Or manually:

1. Push this code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" → Import your repository
4. Add environment variable:
   - `DATABASE_URL` = your Neon connection string
5. Click "Deploy"

### 3. Initialize Database

After deploying, run this in your terminal:
```bash
npx drizzle-kit push
```

Or the database tables will be created automatically on first use.

## Local Development

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# Push database schema
npx drizzle-kit push

# Run development server
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |

## License

MIT
