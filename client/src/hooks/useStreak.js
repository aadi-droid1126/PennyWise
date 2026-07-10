import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { isThisMonth } from "../utils/dateHelpers";

export const useStreak = () => {
  const [streak, setStreak] = useState(0);
  const [lastActive, setLastActive] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/transactions");
      if (!data || data.length === 0) {
        setStreak(0);
        setLastActive(null);
        return;
      }

      // Sort by date descending
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt),
      );

      // Count consecutive days with at least one transaction
      const daySet = new Set(
        sorted.map(
          (tx) => new Date(tx.date || tx.createdAt).toISOString().split("T")[0],
        ),
      );

      const days = Array.from(daySet).sort((a, b) => new Date(b) - new Date(a));
      setLastActive(days[0] || null);

      let count = 1;
      for (let i = 0; i < days.length - 1; i++) {
        const curr = new Date(days[i]);
        const next = new Date(days[i + 1]);
        const diff = (curr - next) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          count++;
        } else {
          break;
        }
      }

      setStreak(count);
    } catch {
      setStreak(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Transactions logged this month
  const [thisMonth, setThisMonth] = useState(0);
  useEffect(() => {
    api
      .get("/transactions")
      .then(({ data }) => {
        setThisMonth(
          data.filter((tx) => isThisMonth(tx.date || tx.createdAt)).length,
        );
      })
      .catch(() => {});
  }, []);

  return { streak, lastActive, loading, thisMonth, refetch: fetch };
};
