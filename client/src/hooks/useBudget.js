import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const useBudget = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/budgets");
      setBudgets(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch budgets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addBudget = async (payload) => {
    await api.post("/budgets", payload);
    await fetch();
  };

  const updateBudget = async (id, payload) => {
    await api.put(`/budgets/${id}`, payload);
    await fetch();
  };

  const deleteBudget = async (id) => {
    await api.delete(`/budgets/${id}`);
    setBudgets((prev) => prev.filter((b) => b._id !== id));
  };

  return {
    budgets,
    loading,
    error,
    refetch: fetch,
    addBudget,
    updateBudget,
    deleteBudget,
  };
};
