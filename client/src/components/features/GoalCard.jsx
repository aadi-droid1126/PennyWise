import { useState } from "react";
import { fmt } from "../../utils/formatters";
import { fmtDate } from "../../utils/dateHelpers";

const GoalCard = ({ goal, onDelete, onContribute }) => {
  const [hovered, setHovered] = useState(false);
  const [contributing, setContributing] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const percent = Math.min(Math.round((goal.savedAmount / goal.targetAmount) * 100), 100);
  const remaining = Math.max(goal.targetAmount - goal.savedAmount, 0);
  const isComplete = goal.savedAmount >= goal.targetAmount;

  const handleContribute = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;
    setLoading(true);
    await onContribute(goal._id, Number(amount));
    setAmount("");
    setContributing(false);
    setLoading(false);
  };

  return (
    <div
      style={{ background: "var(--card-bg)", border: `1px solid ${isComplete ? "#1a4a1a" : "var(--border)"}`, padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem", transition: "border-color 0.2s" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", fontWeight: 600, color: "var(--dirty-white)" }}>{goal.title}</span>
          {goal.deadline && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)", letterSpacing: "0.05em" }}>
              Deadline: {fmtDate(goal.deadline)}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {isComplete && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "#4caf50", border: "1px solid #1a4a1a", padding: "0.15rem 0.4rem", letterSpacing: "0.1em" }}>
              ESCAPED
            </span>
          )}
          <button onClick={() => onDelete(goal._id)} style={{ background: "none", border: "none", color: hovered ? "var(--balloon-red)" : "var(--muted)", fontSize: "0.7rem", cursor: "pointer", transition: "color 0.2s", lineHeight: 1, padding: "0.25rem" }}>✕</button>
        </div>
      </div>

      <div>
        <div style={{ height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden", marginBottom: "0.5rem" }}>
          <div style={{ height: "100%", width: `${percent}%`, background: isComplete ? "#4caf50" : "var(--balloon-red)", borderRadius: "2px", transition: "width 0.5s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: isComplete ? "#4caf50" : "var(--dirty-white)" }}>
            {fmt(goal.savedAmount)} / {fmt(goal.targetAmount)}
          </span>
          <span style={{ fontFamily: "var(--font-horror)", fontSize: "1rem", color: isComplete ? "#4caf50" : "var(--balloon-red)" }}>{percent}%</span>
        </div>
        {!isComplete && (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)" }}>{fmt(remaining)} remaining to escape</span>
        )}
      </div>

      {!isComplete && (
        <div>
          {contributing ? (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input type="number" min="0" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)}
                style={{ flex: 1, background: "var(--dark-bg)", border: "1px solid var(--border)", color: "var(--dirty-white)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", padding: "0.5rem 0.75rem", outline: "none", borderRadius: 0, colorScheme: "dark" }} />
              <button onClick={handleContribute} disabled={loading}
                style={{ background: "var(--balloon-red)", border: "none", color: "var(--dirty-white)", fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.1em", padding: "0.5rem 0.75rem", cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
                {loading ? "..." : "ADD"}
              </button>
              <button onClick={() => { setContributing(false); setAmount(""); }}
                style={{ background: "none", border: "1px solid var(--border)", color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "0.7rem", padding: "0.5rem 0.75rem", cursor: "pointer" }}>✕</button>
            </div>
          ) : (
            <button onClick={() => setContributing(true)}
              style={{ width: "100%", background: "transparent", border: "1px solid var(--border)", color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.1em", padding: "0.5rem", cursor: "pointer", transition: "border-color 0.2s, color 0.2s" }}>
              + CONTRIBUTE
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalCard;
