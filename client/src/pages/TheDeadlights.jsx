import { useState } from "react";
import Layout from "../components/Layout";
import Panel from "../components/ui/Panel";
import Button from "../components/ui/Button";
import BudgetBar from "../components/features/BudgetBar";
import { useBudget } from "../hooks/useBudget";
import { useTransactions } from "../hooks/useTransactions";
import { usePennywiseVoice } from "../context/PennywiseVoiceContext";

const CATEGORIES = ["food", "transport", "entertainment", "health", "shopping", "utilities", "rent", "other"];

const TheDeadlights = () => {
    const { speak } = usePennywiseVoice();
    const now = new Date();
    const { budgets, loading, addBudget, updateBudget, deleteBudget } = useBudget();
    const { transactions } = useTransactions();
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ category: "food", limit: "" });

    // Sum this month's expenses per category, to feed each BudgetBar's `spent` prop
    const spentByCategory = {};
    transactions
        .filter((tx) => {
            const d = new Date(tx.date || tx.createdAt);
            return tx.type === "expense" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .forEach((tx) => {
            spentByCategory[tx.category] = (spentByCategory[tx.category] || 0) + tx.amount;
        });

    const handleSubmit = async () => {
        setError("");
        if (!form.limit || isNaN(form.limit) || Number(form.limit) <= 0) {
            setError("Set a real limit. IT is watching.");
            return;
        }
        setSubmitting(true);
        try {
            await addBudget({
                month: now.getMonth() + 1,
                year: now.getFullYear(),
                limits: [{ category: form.category, amount: Number(form.limit) }],
            });
            setForm({ category: "food", limit: "" });
            setShowForm(false);
            speak("budget");
        } catch (err) {
            setError(err?.response?.data?.message || "IT rejected the deadlight.");
        } finally {
            setSubmitting(false);
        }
    };

    // Flatten limits across all budget docs into individual bars
    const bars = budgets.flatMap((b) =>
        (b.limits || []).map((l) => ({
            _id: `${b._id}-${l.category}`,
            budgetId: b._id,
            category: l.category,
            limit: l.amount,
        })),
    );

    // Removing one category's bar should only drop that category, not the
    // whole month's budget doc.
    const handleRemoveBar = async (bar) => {
        const parent = budgets.find((b) => b._id === bar.budgetId);
        if (!parent) return;
        const remaining = parent.limits.filter((l) => l.category !== bar.category);
        if (remaining.length === 0) {
            await deleteBudget(bar.budgetId);
        } else {
            await updateBudget(bar.budgetId, { limits: remaining });
        }
    };

    const anyOver = bars.some((bar) => (spentByCategory[bar.category] || 0) > bar.limit);

    return (
        <Layout>
            <div style={{ minHeight: "100%", color: "var(--dirty-white)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ width: "3px", height: "36px", background: "var(--balloon-red)", flexShrink: 0 }} />
                        <div>
                            <h1 style={{ fontFamily: "var(--font-horror)", fontSize: "1.8rem", letterSpacing: "0.2em", color: "var(--dirty-white)", lineHeight: 1 }}>
                                THE DEADLIGHTS
                            </h1>
                            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.05em", marginTop: "0.2rem" }}>
                                Set your limits. IT gives you two weeks.
                            </p>
                        </div>
                    </div>
                    <Button variant="primary" onClick={() => { setShowForm((v) => !v); setError(""); }}>
                        {showForm ? "✕ CANCEL" : "+ SET LIMIT"}
                    </Button>
                </div>

                {anyOver && (
                    <div style={{ marginBottom: "1.25rem", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--balloon-red)" }}>
                        {`It's watching. You've gone over on at least one category.`}
                    </div>
                )}

                {showForm && (
                    <Panel title="New Deadlight" style={{ marginBottom: "1.25rem" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                            <div>
                                <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", letterSpacing: "0.15em", display: "block", marginBottom: "0.4rem" }}>
                                    CATEGORY
                                </label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                                    style={{ background: "var(--dark-bg)", border: "1px solid var(--border)", color: "var(--dirty-white)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", padding: "0.6rem 0.75rem", width: "100%", boxSizing: "border-box", borderRadius: 0, colorScheme: "dark" }}
                                >
                                    {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", letterSpacing: "0.15em", display: "block", marginBottom: "0.4rem" }}>
                                    MONTHLY LIMIT (₹)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="5000"
                                    value={form.limit}
                                    onChange={(e) => setForm((f) => ({ ...f, limit: e.target.value }))}
                                    style={{ background: "var(--dark-bg)", border: "1px solid var(--border)", color: "var(--dirty-white)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", padding: "0.6rem 0.75rem", width: "100%", boxSizing: "border-box", borderRadius: 0, colorScheme: "dark" }}
                                />
                            </div>
                        </div>
                        {error && <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--balloon-red)", marginBottom: "0.75rem" }}>{error}</p>}
                        <Button variant="ghost" fullWidth disabled={submitting} onClick={handleSubmit}>
                            {submitting ? "SETTING..." : "BIND THE LIMIT"}
                        </Button>
                    </Panel>
                )}

                {loading ? (
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)", textAlign: "center", padding: "3rem 0" }}>
                        IT is calculating your deadlights...
                    </p>
                ) : bars.length === 0 ? (
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)", textAlign: "center", padding: "3rem 0" }}>
                        No limits set. IT is free to roam.
                    </p>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                        {bars.map((bar) => (
                            <BudgetBar
                                key={bar._id}
                                budget={bar}
                                spent={spentByCategory[bar.category] || 0}
                                onDelete={() => handleRemoveBar(bar)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default TheDeadlights;
