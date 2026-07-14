import { useEffect, useRef } from "react";
import { usePennywiseVoice } from "../context/PennywiseVoiceContext";
import api from "../services/api";

// Random ambient mockery — fires on its own every so often, no trigger needed.
//
// TESTING MODE: fast interval, high chance, so you can verify it's firing
// without waiting minutes. Once confirmed, switch back to the PROD values
// commented below.
const AMBIENT_MIN_MS = 15 * 1000; // TEST: 15s   |  PROD: 90 * 1000 (1.5 min)
const AMBIENT_MAX_MS = 30 * 1000; // TEST: 30s   |  PROD: 4 * 60 * 1000 (4 min)
const AMBIENT_CHANCE = 0.9;       // TEST: 90%   |  PROD: 0.4 (40%)

export const usePennywiseAmbient = () => {
  const { speak, speaking } = usePennywiseVoice();
  const timeoutRef = useRef(null);
  const firedCriteria = useRef(new Set());

  useEffect(() => {
    const scheduleNext = () => {
      const delay =
        AMBIENT_MIN_MS + Math.random() * (AMBIENT_MAX_MS - AMBIENT_MIN_MS);
      timeoutRef.current = setTimeout(() => {
        if (!speaking && Math.random() < AMBIENT_CHANCE) {
          speak("dashboard");
        }
        scheduleNext();
      }, delay);
    };

    scheduleNext();
    return () => clearTimeout(timeoutRef.current);
  }, [speak, speaking]);

  useEffect(() => {
    const checkCriteria = async () => {
      try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const { data: summary } = await api.get(
          `/transactions/summary?month=${month}&year=${year}`,
        );

        if (!summary) return;

        const tryFire = (key, context) => {
          if (firedCriteria.current.has(key)) return;
          firedCriteria.current.add(key);
          speak(context);
        };

        if (summary.balance !== undefined && summary.balance < 500) {
          tryFire("lowbalance", "lowbalance");
          return;
        }

        if (
          summary.expenses !== undefined &&
          summary.income !== undefined &&
          summary.expenses > summary.income &&
          summary.income > 0
        ) {
          tryFire("exceeded", "exceeded");
          return;
        }
      } catch {
        // silent — ambient speak is a nice-to-have, not critical
      }
    };

    const t = setTimeout(checkCriteria, 4000);
    return () => clearTimeout(t);
  }, [speak]);
};

export default usePennywiseAmbient;
