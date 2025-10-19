# Cosmic Care 🌌

A Next.js application that visualizes emotional data through an interactive 3D solar system interface. Users can track their daily emotional states across different sessions (morning, afternoon, evening) and view their emotional patterns over time through both 3D visualizations and calendar views.

## ✨ Features

### 🔐 Authentication System
- **Supabase Integration**: Complete user authentication with signup, signin, and signout
- **Protected Routes**: Authentication-required pages with automatic redirects
- **User Profiles**: Display name support with personalized navigation
- **Session Management**: Persistent login sessions with automatic token refresh

### 🌌 3D Solar System Visualization
- **Interactive Solar Scene**: 3D solar system built with Three.js and React Three Fiber
- **Dynamic Orbits**: Planets representing daily sessions with realistic orbital mechanics
- **Moon Systems**: Emotional states visualized as moons orbiting their respective planets
- **Real-time Animation**: Smooth orbital animations with randomized starting positions
- **Analytical Modals**: Detailed emotional analytics for sun and planet interactions

### 📊 Emotional Data Management
- **Structured Schema**: Positive and negative emotions with intensity tracking
- **Session-based Organization**: Morning, afternoon, and evening emotional tracking
- **Intensity Normalization**: All emotions per session sum to 1.0 for consistent visualization
- **Color-coded Emotions**: Visual representation through color-coded emotional states

### 📅 Calendar Visualization
- **GitHub-style Calendar**: Emotional intensity displayed through color gradients
- **Monthly View**: October 2025 data with 17 days of emotional tracking
- **Color Gradients**: 
  - 🟢 Green gradients for positive emotional dominance (5% to 95% positive)
  - 🔴 Red gradients for negative emotional dominance (5% to 95% negative)
  - 🔵 Blue for balanced emotional states (50/50 split)
- **Interactive Tooltips**: Detailed emotional breakdowns on hover
- **Day Details**: Comprehensive session analysis for selected dates

### 🎨 User Interface
- **Space-themed Design**: Dark cosmic background with golden accents
- **Responsive Navigation**: Mobile-friendly navbar with dropdown user menu
- **3D Background**: Animated space background with stars and nebulae
- **Loading States**: Smooth transitions with space-themed loading animations
- **Interactive Elements**: Hover effects, click animations, and smooth transitions

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.6**: React framework with App Router
- **React 19.1.0**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework

### 3D Graphics
- **Three.js**: 3D graphics library
- **React Three Fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers for R3F
- **@react-three/postprocessing**: Post-processing effects

### Backend & Authentication
- **Supabase**: Backend-as-a-Service with authentication
- **@supabase/supabase-js**: JavaScript client library

### Development Tools
- **ESLint**: Code linting and formatting
- **Turbopack**: Fast bundler for development

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd solar-sessions
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
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
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
- **Session Structure**: Each day contains 3 sessions (morning, afternoon, evening)
- **Color Coding**: Consistent color schemes for emotional visualization
- **Date Format**: ISO date strings (YYYY-MM-DD) for consistency

## 🎮 Usage

### Authentication Flow
1. **Sign Up**: Create account with email, password, and display name
2. **Sign In**: Access existing account
3. **Protected Access**: Automatic redirect to login for protected pages
4. **Sign Out**: Secure logout with session cleanup

### 3D Solar System (`/dummy/today`)
- **Sun**: Represents the day with overall emotional analytics
- **Planets**: Each planet represents a session (morning, afternoon, evening)
- **Moons**: Emotional states orbiting their respective planets
- **Interactions**: Click planets/sun for detailed emotional analytics
- **Analytics**: Emotional balance scores, distribution charts, dominant emotions

### Calendar View (`/dummy/my-calendar`)
- **Color Coding**: Emotional intensity through color gradients
- **Interactive**: Click dates for detailed emotional breakdowns
- **Tooltips**: Hover for quick emotional summaries
- **Monthly Overview**: October 2025 emotional patterns


### Animations
- **Orbital Mechanics**: Realistic planet and moon orbits
- **Space Background**: Animated stars and nebulae
- **UI Transitions**: Smooth hover effects and loading states
- **Modal Animations**: Fade-in effects for analytical overlays

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

## 🙏 Acknowledgments

- **Three.js**: For the amazing 3D graphics library
- **Supabase**: For the powerful backend-as-a-service platform
- **Next.js**: For the excellent React framework
- **React Three Fiber**: For seamless Three.js integration with React

---

Built using Next.js, Three.js, and Supabase