import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPennywiseRoast } from "../../utils/contextualRoast";
import { speakAsPennywise, stopSpeaking } from "../../utils/voiceNarrator";

export default function PennywiseRoast({ context = "dashboard", autoLoad = false }) {
  const [roast, setRoast] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [visible, setVisible] = useState(false);

  const fetchRoast = async () => {
    setLoading(true);
    setVisible(true);
    stopSpeaking();
    setSpeaking(false);
    const text = await getPennywiseRoast(context);
    setRoast(text);
    setLoading(false);
  };

  useEffect(() => {
    if (autoLoad) fetchRoast();
  }, [context]);

  const handleSpeak = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    speakAsPennywise(roast, () => setSpeaking(false));
  };

  return (
    <div className="w-full">
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={fetchRoast}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold w-full justify-center"
        style={{
          background: "var(--sewer-black)",
          color: "var(--balloon-red)",
          border: "1px solid var(--crimson)",
        }}
      >
        {loading ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            🎈
          </motion.span>
        ) : (
          "🎈"
        )}
        {loading ? "Pennywise is thinking..." : "Pennywise Speaks"}
      </motion.button>

      {/* Roast Panel */}
      <AnimatePresence>
        {visible && roast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-3 p-4 rounded-xl border relative"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--crimson)",
            }}
          >
            {/* Clown eye decoration */}
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">🤡</span>
              <p
                className="text-sm leading-relaxed italic flex-1"
                style={{ color: "var(--dirty-white)" }}
              >
                {roast}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSpeak}
                className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold"
                style={{
                  background: speaking ? "var(--crimson)" : "var(--sewer-black)",
                  color: "white",
                  border: "1px solid var(--balloon-red)",
                }}
              >
                <motion.span
                  animate={speaking ? { scale: [1, 1.4, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 0.7 }}
                >
                  🎈
                </motion.span>
                {speaking ? "Stop IT" : "Hear IT"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchRoast}
                className="px-3 py-1 rounded-lg text-xs"
                style={{
                  background: "var(--sewer-black)",
                  color: "var(--muted)",
                  border: "1px solid var(--border)",
                }}
              >
                🔄 Again
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setVisible(false); stopSpeaking(); setSpeaking(false); }}
                className="px-3 py-1 rounded-lg text-xs ml-auto"
                style={{
                  background: "var(--sewer-black)",
                  color: "var(--muted)",
                  border: "1px solid var(--border)",
                }}
              >
                ✕
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}