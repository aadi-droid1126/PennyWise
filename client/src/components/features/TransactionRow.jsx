import { useState } from "react";
import { fmt } from "../../utils/formatters";
import { fmtDate } from "../../utils/dateHelpers";

const TransactionRow = ({ tx, onDelete, isLast = false }) => {
  const [deleting, setDeleting] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(tx._id);
    setDeleting(false);
  };

  const isExpense = tx.type === "expense";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.85rem 1.25rem",
        borderBottom: isLast ? "none" : "1px solid var(--border)",
        gap: "0.75rem",
        background: hovered ? "rgba(255,255,255,0.02)" : "transparent",
        transition: "background 0.15s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Category + Note */}
      <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: "0.2rem", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.55rem",
              letterSpacing: "0.1em",
              padding: "0.15rem 0.4rem",
              border: "1px solid",
              flexShrink: 0,
              background: isExpense ? "rgba(139,0,0,0.3)" : "rgba(10,42,10,0.5)",
              color: isExpense ? "var(--balloon-red)" : "#4caf50",
              borderColor: isExpense ? "#3a0000" : "#0a2a0a",
            }}
          >
            {isExpense ? "FLOATER" : "SURVIVOR"}
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              color: "var(--dirty-white)",
              fontWeight: 500,
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {tx.category}
          </span>
        </div>
        {tx.description && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "var(--muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {tx.description}
          </span>
        )}
      </div>

      {/* Date */}
      <div style={{ flex: 1 }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "var(--muted)",
          }}
        >
          {fmtDate(tx.date || tx.createdAt)}
        </span>
      </div>

      {/* Amount */}
      <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.9rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
            color: isExpense ? "var(--balloon-red)" : "#4caf50",
          }}
        >
          {isExpense ? "-" : "+"}
          {fmt(tx.amount)}
        </span>
      </div>

      {/* Delete */}
      <div style={{ width: "40px", display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleDelete}
          disabled={deleting}
          title="Delete"
          style={{
            background: "none",
            border: "none",
            color: hovered ? "var(--balloon-red)" : "var(--muted)",
            fontSize: "0.7rem",
            cursor: "pointer",
            padding: "0.25rem",
            transition: "color 0.2s",
            lineHeight: 1,
            opacity: deleting ? 0.4 : 1,
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default TransactionRow;