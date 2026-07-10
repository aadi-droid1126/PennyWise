import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [txRes, sumRes] = await Promise.all([
        api.get("/transactions"),
        api.get("/transactions/summary"),
      ]);
      setTransactions(txRes.data);
      setSummary(sumRes.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addTransaction = async (payload) => {
    await api.post("/transactions", payload);
    await fetch();
  };

  const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
    setTransactions((prev) => prev.filter((tx) => tx._id !== id));
  };

  return {
    transactions,
    summary,
    loading,
    error,
    refetch: fetch,
    addTransaction,
    deleteTransaction,
  };
};
