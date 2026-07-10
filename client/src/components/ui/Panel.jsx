const Panel = ({ children, title, action, style = {} }) => {
  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        ...style,
      }}
    >
      {title && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.85rem 1.25rem",
            borderBottom: "1px solid var(--border)",
            background: "var(--sewer-black)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--muted)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            {title}
          </span>
          {action && (
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "var(--crimson)",
              }}
            >
              {action}
            </div>
          )}
        </div>
      )}
      <div style={{ padding: "1.25rem" }}>{children}</div>
    </div>
  );
};

export default Panel;