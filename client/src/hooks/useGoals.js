import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/goals");
      setGoals(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch goals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addGoal = async (payload) => {
    await api.post("/goals", payload);
    await fetch();
  };

  const updateGoal = async (id, payload) => {
    await api.put(`/goals/${id}`, payload);
    await fetch();
  };

  const deleteGoal = async (id) => {
    await api.delete(`/goals/${id}`);
    setGoals((prev) => prev.filter((g) => g._id !== id));
  };

  return {
    goals,
    loading,
    error,
    refetch: fetch,
    addGoal,
    updateGoal,
    deleteGoal,
  };
};
