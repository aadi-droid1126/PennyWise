import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TheLair = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong down here.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.bg} />

      <div className="lair-left">
        <div style={styles.leftInner}>
          <div style={styles.logoMark}>
            <div style={styles.logoLine} />
            <span style={styles.logoSymbol}>¢</span>
            <div style={styles.logoLine} />
          </div>
          <h1 style={styles.bigTitle}>PENNYWISE</h1>
          <p style={styles.leftTag}>We all spend down here.</p>
          <div style={styles.leftMeta}>
            <span style={styles.metaItem}>₹ EXPENSE TRACKER</span>
            <span style={styles.metaDot}>·</span>
            <span style={styles.metaItem}>EST. 2025</span>
          </div>
        </div>
      </div>

      <div className="lair-right">
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.redBar} />
            <span style={styles.cardTitle}>
              {mode === "login" ? "ENTER THE LAIR" : "JOIN THE LOSERS"}
            </span>
          </div>

          <div style={styles.tabs}>
            <button
              style={{ ...styles.tab, ...(mode === "login" ? styles.tabActive : {}) }}
              onClick={() => { setMode("login"); setError(""); }}
            >
              Sign In
            </button>
            <button
              style={{ ...styles.tab, ...(mode === "register" ? styles.tabActive : {}) }}
              onClick={() => { setMode("register"); setError(""); }}
            >
              Register
            </button>
          </div>

          <form onSubmit={submit} style={styles.form}>
            {mode === "register" && (
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input
                  style={styles.input}
                  name="name"
                  type="text"
                  placeholder="What do they call you?"
                  value={form.name}
                  onChange={handle}
                  required
                />
              </div>
            )}

            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                name="email"
                type="email"
                placeholder="your@soul.com"
                value={form.email}
                onChange={handle}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handle}
                required
              />
            </div>

            {error && <p style={styles.error}>— {error}</p>}

            <button
              style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }}
              type="submit"
              disabled={loading}
            >
              {loading
                ? "DESCENDING..."
                : mode === "login"
                ? "ENTER THE SEWER"
                : "JOIN THE LOSERS"}
            </button>
          </form>

          <p style={styles.foot}>
            {mode === "login" ? "New here? " : "Already one of us? "}
            <span
              style={styles.link}
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            >
              {mode === "login" ? "Join us." : "Enter the Lair."}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  root: {
    minHeight: "100vh",
    display: "flex",
    background: "var(--dark-bg)",
    position: "relative",
    overflow: "hidden",
  },
  bg: {
    position: "fixed",
    inset: 0,
    background: "radial-gradient(ellipse at 20% 50%, #1a0000 0%, transparent 60%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  leftInner: {
    maxWidth: "420px",
  },
  logoMark: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "2rem",
  },
  logoLine: {
    flex: 1,
    height: "1px",
    background: "var(--crimson)",
    maxWidth: "40px",
  },
  logoSymbol: {
    fontFamily: "var(--font-horror)",
    fontSize: "2rem",
    color: "var(--balloon-red)",
    lineHeight: 1,
  },
  accent: {
    width: "40px",
    height: "3px",
    background: "var(--balloon-red)",
    marginBottom: "2rem",
  },
  bigTitle: {
    fontFamily: "var(--font-horror)",
    fontSize: "clamp(3rem, 5.5vw, 5rem)",
    color: "var(--dirty-white)",
    letterSpacing: "0.2em",
    lineHeight: 1,
    marginBottom: "1.5rem",
    whiteSpace: "nowrap",
  },
  leftTag: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.8rem",
    color: "var(--muted)",
    letterSpacing: "0.1em",
    marginBottom: "2rem",
  },
  leftMeta: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  metaItem: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    color: "var(--crimson)",
    letterSpacing: "0.15em",
  },
  metaDot: {
    color: "var(--border)",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "2rem",
  },
  redBar: {
    width: "3px",
    height: "20px",
    background: "var(--balloon-red)",
    flexShrink: 0,
  },
  cardTitle: {
    fontFamily: "var(--font-horror)",
    fontSize: "1.4rem",
    color: "var(--dirty-white)",
    letterSpacing: "0.2em",
  },
  tabs: {
    display: "flex",
    marginBottom: "2rem",
    borderBottom: "1px solid var(--border)",
  },
  tab: {
    flex: 1,
    background: "none",
    border: "none",
    borderBottom: "1px solid transparent",
    color: "var(--muted)",
    fontFamily: "var(--font-body)",
    fontSize: "0.8rem",
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "0.6rem 0",
    cursor: "pointer",
    marginBottom: "-1px",
    transition: "color 0.2s, border-color 0.2s",
  },
  tabActive: {
    color: "var(--dirty-white)",
    borderBottomColor: "var(--balloon-red)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    color: "var(--muted)",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  input: {
    background: "transparent",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderBottom: "1px solid var(--border)",
    borderRadius: 0,
    color: "var(--dirty-white)",
    fontFamily: "var(--font-mono)",
    fontSize: "0.9rem",
    padding: "0.6rem 0",
    outline: "none",
    width: "100%",
  },
  error: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.75rem",
    color: "var(--balloon-red)",
    letterSpacing: "0.05em",
  },
  btn: {
    marginTop: "0.5rem",
    background: "var(--balloon-red)",
    border: "none",
    borderRadius: 0,
    color: "var(--dirty-white)",
    fontFamily: "var(--font-horror)",
    fontSize: "1.1rem",
    letterSpacing: "0.2em",
    padding: "0.9rem",
    cursor: "pointer",
    transition: "background 0.2s, opacity 0.2s",
    width: "100%",
  },
  foot: {
    marginTop: "1.5rem",
    fontFamily: "var(--font-mono)",
    fontSize: "0.72rem",
    color: "var(--muted)",
    letterSpacing: "0.05em",
  },
  link: {
    color: "var(--dirty-white)",
    cursor: "pointer",
    borderBottom: "1px solid var(--crimson)",
    paddingBottom: "1px",
  },
};

export default TheLair;