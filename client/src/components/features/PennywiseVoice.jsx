import { motion } from "framer-motion";
import { usePennywiseVoice } from "../../context/PennywiseVoiceContext";

// Manual button — still usable anywhere you want an explicit "Hear IT" trigger
export function PennywiseVoiceButton({ context = "dashboard", label = "Hear IT 🎈" }) {
  const { speak, stop, speaking } = usePennywiseVoice();

  const handleClick = () => {
    if (speaking) {
      stop();
    } else {
      speak(context);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold"
      style={{
        background: speaking ? "var(--crimson)" : "var(--sewer-black)",
        color: speaking ? "white" : "var(--balloon-red)",
        border: "1px solid var(--balloon-red)",
        transition: "all 0.2s",
      }}
    >
      <motion.span
        animate={speaking ? { scale: [1, 1.3, 1] } : {}}
        transition={{ repeat: Infinity, duration: 0.8 }}
      >
        🎈
      </motion.span>
      {speaking ? "Stop IT" : label}
    </motion.button>
  );
}

// Passive indicator — shows automatically whenever Pennywise speaks on his own,
// no click required. Drop this once in Layout.jsx so it's visible everywhere.
export function PennywiseVoiceIndicator() {
  const { speaking, stop, lastLine } = usePennywiseVoice();

  if (!speaking) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      onClick={stop}
      className="fixed bottom-20 md:bottom-6 right-4 max-w-xs px-4 py-3 rounded-lg cursor-pointer z-50"
      style={{
        background: "var(--sewer-black)",
        border: "1px solid var(--balloon-red)",
        color: "var(--balloon-red)",
      }}
      title="Tap to stop IT"
    >
      <div className="flex items-center gap-2">
        <motion.span
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        >
          🎈
        </motion.span>
        <span className="text-xs font-semibold">IT is speaking...</span>
      </div>
      {lastLine && <p className="text-xs mt-1 opacity-80">{lastLine}</p>}
    </motion.div>
  );
}

export default PennywiseVoiceButton;