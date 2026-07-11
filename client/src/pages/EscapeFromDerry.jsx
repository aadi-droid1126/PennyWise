import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import PennywiseRoast from "../components/features/PennywiseRoast";
import Layout from "../components/Layout";
function EscapeFromDerry() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [form, setForm] = useState({
    title: "",
    targetAmount: "",
    savedAmount: "",
    deadline: "",
  });

  const fetchGoals = async () => {
    try {
      const res = await api.get("/goals");
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.targetAmount) return;
    try {
      if (editGoal) {
        await api.put(`/goals/${editGoal._id}`, {
          ...form,
          targetAmount: parseFloat(form.targetAmount),
          savedAmount: parseFloat(form.savedAmount) || 0,
        });
      } else {
        await api.post("/goals", {
          ...form,
          targetAmount: parseFloat(form.targetAmount),
          savedAmount: parseFloat(form.savedAmount) || 0,
        });
      }
      setForm({ title: "", targetAmount: "", savedAmount: "", deadline: "" });
      setShowForm(false);
      setEditGoal(null);
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (goal) => {
    setEditGoal(goal);
    setForm({
      title: goal.title,
      targetAmount: goal.targetAmount,
      savedAmount: goal.savedAmount,
      deadline: goal.deadline ? goal.deadline.split("T")[0] : "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  const getProgress = (saved, target) => Math.min((saved / target) * 100, 100);

  const getBalloonColor = (progress) => {
    if (progress >= 100) return "#FF1744";
    if (progress >= 75) return "#ff4444";
    if (progress >= 50) return "#cc0000";
    if (progress >= 25) return "#8B0000";
    return "#3a0000";
  };

  return (
    <Layout>
      <div
        className="p-4 md:p-8"
        style={{ color: "var(--dirty-white)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ color: "var(--balloon-red)" }}
            >
              🎈 Escape from Derry
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              Your savings goals. Run before IT catches you.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowForm(!showForm);
              setEditGoal(null);
              setForm({ title: "", targetAmount: "", savedAmount: "", deadline: "" });
            }}
            className="px-4 py-2 rounded-lg font-semibold text-white"
            style={{ background: "var(--balloon-red)" }}
          >
            {showForm ? "Cancel" : "+ New Escape Plan"}
          </motion.button>
        </div>
        {/* Pennywise Roast */}
        <div className="mb-6">
          <PennywiseRoast context="goals" />
        </div>
        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-xl p-6 mb-8 border"
              style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}
            >
              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: "var(--balloon-red)" }}
              >
                {editGoal ? "Update Escape Plan" : "New Escape Plan"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label
                    className="text-xs mb-1 block"
                    style={{ color: "var(--muted)" }}
                  >
                    What are you escaping for?
                  </label>
                  <input
                    type="text"
                    placeholder="New laptop, Goa trip, Emergency fund..."
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full p-2 rounded-lg border text-sm"
                    style={{
                      background: "var(--sewer-black)",
                      borderColor: "var(--border)",
                      color: "var(--dirty-white)",
                    }}
                  />
                </div>

                <div>
                  <label
                    className="text-xs mb-1 block"
                    style={{ color: "var(--muted)" }}
                  >
                    Target Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="50000"
                    value={form.targetAmount}
                    onChange={(e) =>
                      setForm({ ...form, targetAmount: e.target.value })
                    }
                    className="w-full p-2 rounded-lg border text-sm"
                    style={{
                      background: "var(--sewer-black)",
                      borderColor: "var(--border)",
                      color: "var(--dirty-white)",
                    }}
                  />
                </div>

                <div>
                  <label
                    className="text-xs mb-1 block"
                    style={{ color: "var(--muted)" }}
                  >
                    Already Saved (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={form.savedAmount}
                    onChange={(e) =>
                      setForm({ ...form, savedAmount: e.target.value })
                    }
                    className="w-full p-2 rounded-lg border text-sm"
                    style={{
                      background: "var(--sewer-black)",
                      borderColor: "var(--border)",
                      color: "var(--dirty-white)",
                    }}
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    className="text-xs mb-1 block"
                    style={{ color: "var(--muted)" }}
                  >
                    Escape Deadline
                  </label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) =>
                      setForm({ ...form, deadline: e.target.value })
                    }
                    className="w-full p-2 rounded-lg border text-sm"
                    style={{
                      background: "var(--sewer-black)",
                      borderColor: "var(--border)",
                      color: "var(--dirty-white)",
                    }}
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
                {editGoal ? "Update Plan 🎈" : "Start Escaping 🎈"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Goals Grid */}
        {loading ? (
          <div className="text-center py-20" style={{ color: "var(--muted)" }}>
            🎈 Loading escape plans...
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎈</div>
            <p style={{ color: "var(--muted)" }}>
              No escape plans yet. IT approves.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {goals.map((goal) => {
                const progress = getProgress(goal.savedAmount, goal.targetAmount);
                const balloonColor = getBalloonColor(progress);
                const isComplete = progress >= 100;

                return (
                  <motion.div
                    key={goal._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="rounded-xl p-5 border relative overflow-hidden"
                    style={{
                      background: "var(--card-bg)",
                      borderColor: isComplete ? "var(--balloon-red)" : "var(--border)",
                    }}
                  >
                    {/* Completed badge */}
                    {isComplete && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-bold"
                        style={{ background: "var(--balloon-red)", color: "white" }}
                      >
                        ESCAPED! 🎈
                      </motion.div>
                    )}

                    {/* Balloon SVG */}
                    <div className="flex justify-center mb-4">
                      <motion.svg
                        width="60"
                        height="80"
                        viewBox="0 0 60 80"
                        animate={isComplete ? { y: [0, -10, 0] } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        {/* Balloon body */}
                        <ellipse
                          cx="30"
                          cy="30"
                          rx="22"
                          ry="26"
                          fill={balloonColor}
                          opacity={0.3 + (progress / 100) * 0.7}
                        />
                        {/* Fill level */}
                        <clipPath id={`fill-${goal._id}`}>
                          <rect
                            x="0"
                            y={56 - (progress / 100) * 56}
                            width="60"
                            height="56"
                          />
                        </clipPath>
                        <ellipse
                          cx="30"
                          cy="30"
                          rx="22"
                          ry="26"
                          fill={balloonColor}
                          clipPath={`url(#fill-${goal._id})`}
                        />
                        {/* Shine */}
                        <ellipse cx="22" cy="18" rx="5" ry="7" fill="white" opacity="0.2" />
                        {/* Knot */}
                        <circle cx="30" cy="57" r="2" fill={balloonColor} />
                        {/* String */}
                        <path
                          d="M30 59 Q25 65 30 72 Q35 79 30 80"
                          stroke={balloonColor}
                          strokeWidth="1.5"
                          fill="none"
                          opacity="0.6"
                        />
                      </motion.svg>
                    </div>

                    {/* Goal info */}
                    <h3 className="font-bold text-lg mb-1 text-center">
                      {goal.title}
                    </h3>

                    {/* Progress bar */}
                    <div
                      className="w-full rounded-full h-2 mb-2 mt-3"
                      style={{ background: "var(--sewer-black)" }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-2 rounded-full"
                        style={{ background: balloonColor }}
                      />
                    </div>

                    <div className="flex justify-between text-xs mb-3" style={{ color: "var(--muted)" }}>
                      <span>₹{goal.savedAmount.toLocaleString("en-IN")} saved</span>
                      <span>{progress.toFixed(0)}%</span>
                      <span>₹{goal.targetAmount.toLocaleString("en-IN")} goal</span>
                    </div>

                    {goal.deadline && (
                      <p className="text-xs text-center mb-3" style={{ color: "var(--muted)" }}>
                        Escape by {new Date(goal.deadline).toLocaleDateString("en-IN")}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleEdit(goal)}
                        className="flex-1 py-1 rounded-lg text-xs font-semibold"
                        style={{ background: "var(--sewer-black)", color: "var(--dirty-white)", border: "1px solid var(--border)" }}
                      >
                        Update
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDelete(goal._id)}
                        className="flex-1 py-1 rounded-lg text-xs font-semibold"
                        style={{ background: "var(--crimson)", color: "white" }}
                      >
                        Abandon
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default EscapeFromDerry;