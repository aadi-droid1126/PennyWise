import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { PennywiseVoiceProvider } from "./context/PennywiseVoiceContext";
import { PennywiseVoiceIndicator } from "./components/features/PennywiseVoice";

import TheLair from "./pages/TheLair";
import LosersLog from "./pages/LosersLog";
import SewerMap from "./pages/SewerMap";
import TheRitual from "./pages/TheRitual";
import EscapeFromDerry from "./pages/EscapeFromDerry";
import TheCaseFile from "./pages/TheCaseFile";
import Dashboard from "./pages/Dashboard";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>loading the sewer...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

const App = () => {
  return (
    <PennywiseVoiceProvider>
      <Routes>
        <Route path="/login" element={<PublicRoute><TheLair /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><TheLair /></PublicRoute>} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><LosersLog /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><SewerMap /></ProtectedRoute>} />
        <Route path="/recurring" element={<ProtectedRoute><TheRitual /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><EscapeFromDerry /></ProtectedRoute>} />
        <Route path="/export" element={<ProtectedRoute><TheCaseFile /></ProtectedRoute>} />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {/* Pennywise speaks on his own here — no click required */}
      <PennywiseVoiceIndicator />
    </PennywiseVoiceProvider>
  );
};

export default App;
