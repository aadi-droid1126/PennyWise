const Button = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  fullWidth = false,
  size = "md",
  type = "button",
}) => {
  const base = {
    fontFamily: "var(--font-horror)",
    letterSpacing: "0.15em",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    border: "none",
    borderRadius: 0,
    transition: "all 0.2s",
    width: fullWidth ? "100%" : "auto",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  };

  const sizes = {
    sm: { fontSize: "0.75rem", padding: "0.4rem 0.8rem" },
    md: { fontSize: "0.9rem", padding: "0.6rem 1.2rem" },
    lg: { fontSize: "1rem", padding: "0.75rem 1.5rem" },
  };

  const variants = {
    primary: {
      background: "var(--balloon-red)",
      color: "var(--dirty-white)",
    },
    ghost: {
      background: "transparent",
      color: "var(--balloon-red)",
      border: "1px solid var(--crimson)",
    },
    danger: {
      background: "transparent",
      color: "var(--muted)",
      border: "1px solid var(--border)",
    },
    success: {
      background: "transparent",
      color: "#4caf50",
      border: "1px solid #1a4a1a",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant] }}
    >
      {children}
    </button>
  );
};

export default Button;