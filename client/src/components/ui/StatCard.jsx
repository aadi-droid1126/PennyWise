import { fmtCompact } from "../../utils/formatters";

const StatCard = ({ label, value, tag, variant = "default", raw = false }) => {
  const borderColors = {
    default: "var(--border)",
    red: "#3a0000",
    green: "#0a2a0a",
    gold: "#2a1f00",
  };

  const valueColors = {
    default: "var(--dirty-white)",
    red: "var(--balloon-red)",
    green: "#4caf50",
    gold: "#f0a500",
  };

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: `1px solid ${borderColors[variant]}`,
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.3rem",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          color: "var(--muted)",
          letterSpacing: "0.15em",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-horror)",
          fontSize: "1.8rem",
          color: valueColors[variant],
          letterSpacing: "0.05em",
          lineHeight: 1,
        }}
      >
        {raw ? value : fmtCompact(value)}
      </span>
      {tag && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--muted)",
          }}
        >
          {tag}
        </span>
      )}
    </div>
  );
};

export default StatCard;