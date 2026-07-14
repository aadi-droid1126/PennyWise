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

const loadingScreenStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.75rem",
  height: "100vh",
  color: "var(--muted)",
  fontFamily: "var(--font-mono)",
  textAlign: "center",
  padding: "1rem",
};

const LoadingScreen = () => (
  <div style={loadingScreenStyle}>
    <div>waking IT up...</div>
    <div style={{ fontSize: "0.7rem", opacity: 0.6, maxWidth: "280px" }}>
      the server sleeps when idle. this can take up to a minute on first
      load — it won't be this slow again.
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
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
