# Cosmic Care 🌌

A Next.js application that visualizes emotional data through an interactive 3D solar system interface. Users can track their daily emotional states through voice recordings, AI-powered emotion analysis, and view their emotional patterns over time through both 3D visualizations and calendar views.

## ✨ Features

### 🔐 Authentication System
- **Supabase Integration**: Complete user authentication with signup, signin, and signout
- **Protected Routes**: Authentication-required pages with automatic redirects
- **User Profiles**: Display name support with personalized navigation
- **Session Management**: Persistent login sessions with automatic token refresh

### 🎤 Voice Recording & AI Analysis
- **Audio Recording**: Browser-based microphone recording with real-time timer
- **Speech-to-Text**: OpenAI Whisper integration for accurate transcription
- **AI Emotion Analysis**: Google Gemini 2.0 Flash for intelligent emotion detection
- **Personalized Advice**: AI-generated wellness recommendations based on emotional content
- **Session Naming**: Automatic generation of descriptive session names

### 🌌 3D Solar System Visualization
- **Interactive Solar Scene**: 3D solar system built with Three.js and React Three Fiber
- **Dynamic Orbits**: Planets representing daily sessions with realistic orbital mechanics
- **Moon Systems**: Emotional states visualized as moons orbiting their respective planets
- **Real-time Animation**: Smooth orbital animations with randomized starting positions
- **Analytical Modals**: Detailed emotional analytics for sun and planet interactions
- **Camera Controls**: Smooth camera transitions and focus on selected planets
- **Hover Interactions**: Rich tooltips and highlighting effects

### 📊 Emotional Data Management
- **Structured Schema**: Positive and negative emotions with intensity tracking
- **Session-based Organization**: Flexible session tracking (not limited to morning/afternoon/evening)
- **Intensity Normalization**: All emotions per session sum to 1.0 for consistent visualization
- **Color-coded Emotions**: Visual representation through color-coded emotional states
- **Database Integration**: Supabase PostgreSQL with relational emotion data

### 📅 Calendar Visualization
- **GitHub-style Calendar**: Emotional intensity displayed through color gradients
- **Monthly Navigation**: Browse different months with intuitive controls
- **Color Gradients**: 
  - 🟢 Green gradients for positive emotional dominance (5% to 95% positive)
  - 🔴 Red gradients for negative emotional dominance (5% to 95% negative)
  - 🔵 Blue for balanced emotional states (50/50 split)
- **Interactive Tooltips**: Detailed emotional breakdowns on hover
- **Day Details**: Comprehensive session analysis for selected dates
- **Session Breakdown**: Individual session analysis within each day

### 🎨 User Interface
- **Space-themed Design**: Dark cosmic background with golden accents
- **Responsive Navigation**: Mobile-friendly navbar with dropdown user menu
- **3D Background**: Animated space background with stars and nebulae
- **Loading States**: Smooth transitions with space-themed loading animations
- **Interactive Elements**: Hover effects, click animations, and smooth transitions
- **Modal System**: Rich analytical overlays with detailed emotion breakdowns

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.6**: React framework with App Router
- **React 19.1.0**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework

### 3D Graphics
- **Three.js 0.180.0**: 3D graphics library
- **React Three Fiber 9.4.0**: React renderer for Three.js
- **@react-three/drei 10.7.6**: Useful helpers for R3F
- **@react-three/postprocessing 3.0.4**: Post-processing effects

### AI & Audio Processing
- **OpenAI 6.5.0**: Whisper API for speech-to-text transcription
- **Google Generative AI 0.24.1**: Gemini 2.0 Flash for emotion analysis
- **MediaRecorder API**: Browser-based audio recording

### Backend & Database
- **Supabase**: Backend-as-a-Service with PostgreSQL database
- **@supabase/supabase-js 2.75.1**: JavaScript client library
- **PostgreSQL**: Relational database with emotion and session tables

### Development Tools
- **ESLint 9**: Code linting and formatting
- **Turbopack**: Fast bundler for development
- **TypeScript 5**: Type checking and IntelliSense

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Supabase account and project
- OpenAI API key (for Whisper transcription)
- Google AI API key (for Gemini emotion analysis)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cosmic-care
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # AI Services
   OPENAI_API_KEY=your_openai_api_key
   GEMINI_API_KEY=your_google_ai_api_key
   ```

4. **Supabase Configuration**
   - Create a new Supabase project
   - Enable authentication with email/password
   - Configure user metadata for display names
   - Copy your project URL and anon key to `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Data Constraints
- **Intensity Normalization**: Sum of all emotions (positive + negative) per session = 1.0
- **Session Structure**: Flexible session tracking (not limited to specific times)
- **Color Coding**: Consistent color schemes for emotional visualization
- **Date Format**: ISO date strings (YYYY-MM-DD) for consistency
- **Audio Files**: Maximum 25MB for Whisper API processing

## 🎮 Usage

### Authentication Flow
1. **Sign Up**: Create account with email, password, and display name
2. **Sign In**: Access existing account
3. **Protected Access**: Automatic redirect to login for protected pages
4. **Sign Out**: Secure logout with session cleanup

### Voice Recording & Analysis (`/today`)
1. **Start Recording**: Click the floating "+" button to open recording modal
2. **Record Audio**: Use browser microphone to record your thoughts
3. **AI Processing**: Automatic transcription via Whisper and emotion analysis via Gemini
4. **Review Results**: View generated session name, emotions, and personalized advice
5. **Save Session**: Store the session in your personal database

### 3D Solar System Visualization (`/today`)
- **Sun**: Represents the day with overall emotional analytics
- **Planets**: Each planet represents a session with unique colors
- **Moons**: Emotional states orbiting their respective planets
- **Interactions**: 
  - Hover planets for detailed tooltips
  - Click planets for focused analysis and camera tracking
  - Click sun for comprehensive day analysis
- **Analytics**: Emotional balance scores, distribution charts, dominant emotions
- **Camera Controls**: Smooth transitions and focus on selected elements

### Calendar View (`/my-calendar`)
- **Monthly Navigation**: Browse different months with intuitive controls
- **Color Coding**: Emotional intensity through color gradients
- **Interactive**: Click dates for detailed emotional breakdowns
- **Tooltips**: Hover for quick emotional summaries
- **Session Details**: Comprehensive analysis of individual sessions within each day
- **Emotional Trends**: Visual patterns across time periods

### Key Interactions
- **Hover Effects**: Rich tooltips and highlighting throughout the interface
- **Modal System**: Detailed analytical overlays with emotion breakdowns
- **Responsive Design**: Optimized for desktop and mobile experiences
- **Loading States**: Smooth transitions during data processing

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production with Turbopack
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Key Development Features
- **Hot Reload**: Instant updates during development
- **TypeScript**: Full type safety and IntelliSense
- **ESLint**: Code quality and consistency
- **Turbopack**: Fast bundling and compilation
- **API Routes**: Serverless functions for AI processing
- **Database Integration**: Type-safe Supabase client

### Project Structure
```
cosmic-care/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── analyze-emotions/  # Gemini AI emotion analysis
│   │   ├── save-session/      # Session storage
│   │   ├── transcribe-simple/ # Whisper transcription
│   │   └── health/           # Health check endpoint
│   ├── login/             # Authentication pages
│   ├── signup/
│   ├── today/             # 3D solar system view
│   ├── my-calendar/       # Calendar visualization
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── SolarScene.tsx     # Main 3D visualization
│   ├── NavBar.tsx         # Navigation component
│   ├── Recorder.tsx       # Audio recording
│   ├── RecordingModal.tsx # Recording interface
│   └── ...               # Other UI components
├── lib/                  # Utility libraries
│   ├── database.ts       # Supabase database operations
│   ├── whisper.ts        # OpenAI Whisper integration
│   ├── gemini.ts         # Google AI integration
│   └── auth-server.ts    # Server-side authentication
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication state
└── constants/            # Type definitions
    └── today.tsx         # Data structures
```

### API Endpoints
- `POST /api/transcribe-simple` - Audio transcription via Whisper
- `POST /api/analyze-emotions` - Emotion analysis via Gemini
- `POST /api/save-session` - Store session data
- `GET /api/health` - Service health check

### Database Schema
- **emotions**: Available emotion types with colors and polarity
- **sessions**: User sessions with metadata and transcripts
- **session_emotions**: Junction table linking sessions to emotions with intensity

## 🙏 Acknowledgments

- **Three.js**: For the amazing 3D graphics library
- **Supabase**: For the powerful backend-as-a-service platform
- **Next.js**: For the excellent React framework
- **React Three Fiber**: For seamless Three.js integration with React
- **OpenAI**: For the Whisper speech-to-text API
- **Google AI**: For the Gemini emotion analysis capabilities
- **Tailwind CSS**: For the utility-first styling approach

---

Built using Next.js, Three.js, Supabase, OpenAI Whisper, and Google Gemini