import NavBar from "../components/NavBar";
import { AuthProvider } from "../contexts/AuthContext";

export const metadata = { 
  title: "Solar Sessions - Visualize Your Day Through Space", 
  description: "Transform your daily sessions into an interactive 3D solar system. Each planet represents a session, moons represent emotions. Explore your day in beautiful space." 
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <AuthProvider>
          <NavBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}