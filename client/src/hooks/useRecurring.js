import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const useRecurring = () => {
  const [rituals, setRituals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/recurring");
      setRituals(data);
    } catch (err) {
      setError(err?.response?.data?.message || "IT rejected the ritual.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addRitual = async (payload) => {
    await api.post("/recurring", payload);
    await fetch();
  };

  const updateRitual = async (id, payload) => {
    await api.put(`/recurring/${id}`, payload);
    await fetch();
  };

  const deleteRitual = async (id) => {
    await api.delete(`/recurring/${id}`);
    setRituals((prev) => prev.filter((r) => r._id !== id));
  };

  return {
    rituals,
    loading,
    error,
    refetch: fetch,
    addRitual,
    updateRitual,
    deleteRitual,
  };
};
