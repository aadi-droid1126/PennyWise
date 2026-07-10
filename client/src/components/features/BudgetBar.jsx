import { fmt, fmtPercent } from "../../utils/formatters";

const BudgetBar = ({ budget, spent = 0, onDelete }) => {
  const percent = Math.min(
    Math.round((spent / budget.limit) * 100),
    100
  );
  const remaining = Math.max(budget.limit - spent, 0);
  const isOver = spent > budget.limit;
  const isWarning = percent >= 80 && !isOver;

  const barColor = isOver
    ? "var(--balloon-red)"
    : isWarning
    ? "#f0a500"
    : "var(--crimson)";

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: `1px solid ${isOver ? "#3a0000" : "var(--border)"}`,
        padding: "1rem 1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {isOver && (
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.55rem",
                color: "var(--balloon-red)",
                border: "1px solid #3a0000",
                padding: "0.1rem 0.35rem",
                letterSpacing: "0.1em",
              }}
            >
              IT WHISPERS
            </span>
          )}
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "var(--dirty-white)",
              textTransform: "capitalize",
            }}
          >
            {budget.category}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            style={{
              fontFamily: "var(--font-horror)",
              fontSize: "1rem",
              color: barColor,
            }}
          >
            {percent}%
          </span>
          {onDelete && (
            <button
              onClick={() => onDelete(budget._id)}
              style={{
                background: "none",
                border: "none",
                color: "var(--muted)",
                fontSize: "0.7rem",
                cursor: "pointer",
                lineHeight: 1,
                padding: "0.25rem",
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Bar */}
      <div
        style={{
          height: "3px",
          background: "var(--border)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            background: barColor,
            borderRadius: "2px",
            transition: "width 0.5s ease",
          }}
        />
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--muted)",
          }}
        >
          {fmt(spent)} spent of {fmt(budget.limit)}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: isOver ? "var(--balloon-red)" : "var(--muted)",
          }}
        >
          {isOver
            ? `${fmt(Math.abs(remaining))} over budget`
            : `${fmt(remaining)} left`}
        </span>
      </div>
    </div>
  );
};

export default BudgetBar;