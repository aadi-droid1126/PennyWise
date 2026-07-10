import { useState } from "react";
import { motion } from "framer-motion";
import { speakAsPennywise, stopSpeaking } from "../../utils/voiceNarrator";

export default function PennywiseVoice({ text, label = "Hear IT 🎈" }) {
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    speakAsPennywise(text, () => setSpeaking(false));
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleSpeak}
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