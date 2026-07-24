import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PennywiseRoast from "../components/features/PennywiseRoast";
import GoalCard from "../components/features/GoalCard";
import Layout from "../components/Layout";
import { usePennywiseVoice } from "../context/PennywiseVoiceContext";
import { useGoals } from "../hooks/useGoals";

function EscapeFromDerry() {
  const { speak } = usePennywiseVoice();
  const { goals, loading, addGoal, updateGoal, deleteGoal } = useGoals();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", targetAmount: "", savedAmount: "", deadline: "" });

  const handleSubmit = async () => {
    if (!form.title || !form.targetAmount) return;
    try {
      const target = parseFloat(form.targetAmount);
      const saved = parseFloat(form.savedAmount) || 0;
      await addGoal({ ...form, targetAmount: target, savedAmount: saved });
      setForm({ title: "", targetAmount: "", savedAmount: "", deadline: "" });
      setShowForm(false);
      speak(saved >= target ? "goalcomplete" : "goals");
    } catch (err) {
      console.error(err);
    }
  };

  const handleContribute = async (id, amount) => {
    const goal = goals.find((g) => g._id === id);
    if (!goal) return;
    const newSaved = goal.savedAmount + amount;
    await updateGoal(id, { savedAmount: newSaved });
    speak(newSaved >= goal.targetAmount ? "goalcomplete" : "goals");
  };

  const handleDelete = async (id) => {
    await deleteGoal(id);
  };

  return (
    <Layout>
      <div className="p-4 md:p-8" style={{ color: "var(--dirty-white)" }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "var(--balloon-red)" }}>🎈 Escape from Derry</h1>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Your savings goals. Run before IT catches you.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setShowForm(!showForm); setForm({ title: "", targetAmount: "", savedAmount: "", deadline: "" }); }}
            className="px-4 py-2 rounded-lg font-semibold text-white"
            style={{ background: "var(--balloon-red)" }}
          >
            {showForm ? "Cancel" : "+ New Escape Plan"}
          </motion.button>
        </div>

        <div className="mb-6">
          <PennywiseRoast context="goals" />
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-xl p-6 mb-8 border"
              style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: "var(--balloon-red)" }}>New Escape Plan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs mb-1 block" style={{ color: "var(--muted)" }}>What are you escaping for?</label>
                  <input
                    type="text"
                    placeholder="New laptop, Goa trip, Emergency fund..."
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full p-2 rounded-lg border text-sm"
                    style={{ background: "var(--sewer-black)", borderColor: "var(--border)", color: "var(--dirty-white)" }}
                  />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "var(--muted)" }}>Target Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="50000"
                    value={form.targetAmount}
                    onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
                    className="w-full p-2 rounded-lg border text-sm"
                    style={{ background: "var(--sewer-black)", borderColor: "var(--border)", color: "var(--dirty-white)" }}
                  />
                </div>
                <div>
                  <label className="text-xs mb-1 block" style={{ color: "var(--muted)" }}>Already Saved (₹)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.savedAmount}
                    onChange={(e) => setForm({ ...form, savedAmount: e.target.value })}
                    className="w-full p-2 rounded-lg border text-sm"
                    style={{ background: "var(--sewer-black)", borderColor: "var(--border)", color: "var(--dirty-white)" }}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs mb-1 block" style={{ color: "var(--muted)" }}>Escape Deadline</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full p-2 rounded-lg border text-sm"
                    style={{ background: "var(--sewer-black)", borderColor: "var(--border)", color: "var(--dirty-white)" }}
                  />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="mt-4 w-full py-2 rounded-lg font-semibold text-white"
                style={{ background: "var(--crimson)" }}
              >
                Start Escaping 🎈
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="text-center py-20" style={{ color: "var(--muted)" }}>🎈 Loading escape plans...</div>
        ) : goals.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎈</div>
            <p style={{ color: "var(--muted)" }}>No escape plans yet. IT approves.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {goals.map((goal) => (
                <motion.div key={goal._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                  <GoalCard goal={goal} onDelete={handleDelete} onContribute={handleContribute} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default EscapeFromDerry;
