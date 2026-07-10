import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import { fmt } from "../utils/formatters";
import { fmtDate, today } from "../utils/dateHelpers";
import PennywiseRoast from "../components/features/PennywiseRoast";

const CATEGORIES = [
  "food", "transport", "entertainment", "health",
  "shopping", "utilities", "rent", "salary",
  "freelance", "investment", "other",
];

const FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const TheRitual = () => {
  const [rituals, setRituals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    amount: "",
    type: "expense",
    category: "utilities",
    frequency: "monthly",
    startDate: today(),
  });

  useEffect(() => {
    fetchRituals();
  }, []);

  const fetchRituals = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/recurring");
      setRituals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.name.trim()) { setError("Name the ritual."); return; }
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/recurring", { ...form, amount: Number(form.amount) });
      setForm({
        name: "",
        amount: "",
        type: "expense",
        category: "utilities",
        frequency: "monthly",
        startDate: today(),
      });
      setShowForm(false);
      await fetchRituals();
    } catch (err) {
      setError(err?.response?.data?.message || "IT rejected the ritual.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await api.delete(`/recurring/${id}`);
      setRituals((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const totalMonthly = rituals.reduce((acc, r) => {
    if (r.type !== "expense") return acc;
    if (r.frequency === "monthly") return acc + r.amount;
    if (r.frequency === "yearly") return acc + r.amount / 12;
    if (r.frequency === "weekly") return acc + r.amount * 4.33;
    if (r.frequency === "daily") return acc + r.amount * 30;
    return acc;
  }, 0);

  const totalMonthlyIncome = rituals.reduce((acc, r) => {
    if (r.type !== "income") return acc;
    if (r.frequency === "monthly") return acc + r.amount;
    if (r.frequency === "yearly") return acc + r.amount / 12;
    if (r.frequency === "weekly") return acc + r.amount * 4.33;
    if (r.frequency === "daily") return acc + r.amount * 30;
    return acc;
  }, 0);

  return (
    <Layout>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <div style={styles.pageHeaderLeft}>
          <div style={styles.redBar} />
          <div>
            <h1 style={styles.pageTitle}>THE RITUAL</h1>
            <p style={styles.pageSubtitle}>
              Recurring payments. IT never forgets. Neither should you.
            </p>
          </div>
        </div>
        <button
          style={styles.addBtn}
          onClick={() => { setShowForm((v) => !v); setError(""); }}
        >
          {showForm ? "✕ CANCEL" : "+ NEW RITUAL"}
        </button>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderColor: "#3a0000" }}>
          <span style={styles.statLabel}>MONTHLY DRAIN</span>
          <span style={{ ...styles.statValue, color: "var(--balloon-red)" }}>
            {fmt(totalMonthly)}
          </span>
          <span style={styles.statTag}>Recurring expenses/month</span>
        </div>
        <div style={{ ...styles.statCard, borderColor: "#0a2a0a" }}>
          <span style={styles.statLabel}>MONTHLY FLOW</span>
          <span style={{ ...styles.statValue, color: "#4caf50" }}>
            {fmt(totalMonthlyIncome)}
          </span>
          <span style={styles.statTag}>Recurring income/month</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>ACTIVE RITUALS</span>
          <span style={styles.statValue}>{rituals.length}</span>
          <span style={styles.statTag}>Total recurring entries</span>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div style={styles.formPanel}>
          <div style={styles.formPanelHeader}>
            <span style={styles.panelTitle}>NEW RITUAL</span>
            <span style={styles.panelSubtitle}>Bind IT to the schedule.</span>
          </div>

          <div style={styles.typeToggle}>
            <button
              style={{
                ...styles.typeBtn,
                ...(form.type === "expense" ? styles.typeBtnExpenseActive : {}),
              }}
              onClick={() => setForm((f) => ({ ...f, type: "expense" }))}
            >
              FLOATER (EXPENSE)
            </button>
            <button
              style={{
                ...styles.typeBtn,
                ...(form.type === "income" ? styles.typeBtnIncomeActive : {}),
              }}
              onClick={() => setForm((f) => ({ ...f, type: "income" }))}
            >
              SURVIVOR (INCOME)
            </button>
          </div>

          <div style={styles.formGrid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>RITUAL NAME</label>
              <input
                type="text"
                placeholder="e.g. Netflix, Rent, Salary..."
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                style={styles.input}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>AMOUNT (₹)</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                style={styles.input}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>FEAR (CATEGORY)</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                style={styles.select}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>FREQUENCY</label>
              <select
                value={form.frequency}
                onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value }))}
                style={styles.select}
              >
                {FREQUENCIES.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>START DATE</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                style={styles.input}
              />
            </div>
          </div>

          {error && <p style={styles.errorMsg}>{error}</p>}

          <button
            style={{ ...styles.submitBtn, opacity: submitting ? 0.6 : 1 }}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "BINDING THE RITUAL..." : "PERFORM THE RITUAL"}
          </button>
        </div>
      )}

      {/* Rituals List */}
      <div style={styles.panel}>
        {loading ? (
          <p style={styles.empty}>IT is consulting the schedule...</p>
        ) : rituals.length === 0 ? (
          <p style={styles.empty}>No rituals yet. The cycle is unbound.</p>
        ) : (
          <div>
            <div style={styles.tableHeader}>
              <span style={{ ...styles.colHeader, flex: 2 }}>NAME / CATEGORY</span>
              <span style={{ ...styles.colHeader, flex: 1 }}>FREQUENCY</span>
              <span style={{ ...styles.colHeader, flex: 1 }}>NEXT DATE</span>
              <span style={{ ...styles.colHeader, flex: 1, textAlign: "right" }}>AMOUNT</span>
              <span style={{ ...styles.colHeader, width: "40px" }} />
            </div>

            {rituals.map((r, i) => (
              <div
                key={r._id}
                style={{
                  ...styles.txRow,
                  ...(i === rituals.length - 1 ? { borderBottom: "none" } : {}),
                }}
              >
                {/* Name + Category */}
                <div style={{ ...styles.txCell, flex: 2 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span
                      style={{
                        ...styles.typePill,
                        background: r.type === "expense" ? "rgba(139,0,0,0.3)" : "rgba(10,42,10,0.5)",
                        color: r.type === "expense" ? "var(--balloon-red)" : "#4caf50",
                        borderColor: r.type === "expense" ? "#3a0000" : "#0a2a0a",
                      }}
                    >
                      {r.type === "expense" ? "FLOATER" : "SURVIVOR"}
                    </span>
                    <span style={styles.txName}>{r.name}</span>
                  </div>
                  <span style={styles.txNote}>{r.category}</span>
                </div>

                {/* Frequency */}
                <div style={{ ...styles.txCell, flex: 1 }}>
                  <span style={styles.txFreq}>
                    {r.frequency.charAt(0).toUpperCase() + r.frequency.slice(1)}
                  </span>
                </div>

                {/* Next Date */}
                <div style={{ ...styles.txCell, flex: 1 }}>
                  <span style={styles.txDate}>
                    {r.nextDate ? fmtDate(r.nextDate) : fmtDate(r.startDate)}
                  </span>
                </div>

                {/* Amount */}
                <div style={{ ...styles.txCell, flex: 1, alignItems: "flex-end" }}>
                  <span style={{
                    ...styles.txAmount,
                    color: r.type === "expense" ? "var(--balloon-red)" : "#4caf50",
                  }}>
                    {r.type === "expense" ? "-" : "+"}{fmt(r.amount)}
                  </span>
                </div>

                {/* Delete */}
                <div style={{ width: "40px", display: "flex", justifyContent: "flex-end" }}>
                  <button
                    style={{
                      ...styles.deleteBtn,
                      opacity: deleting === r._id ? 0.4 : 1,
                    }}
                    onClick={() => handleDelete(r._id)}
                    disabled={deleting === r._id}
                  >
                    ✕
                  </button>
                </div>
                <div className="mb-6">
                <PennywiseRoast context="ritual" />
              </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

const styles = {
  pageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  pageHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  redBar: {
    width: "3px",
    height: "36px",
    background: "var(--balloon-red)",
    flexShrink: 0,
  },
  pageTitle: {
    fontFamily: "var(--font-horror)",
    fontSize: "1.8rem",
    letterSpacing: "0.2em",
    color: "var(--dirty-white)",
    lineHeight: 1,
  },
  pageSubtitle: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.7rem",
    color: "var(--muted)",
    letterSpacing: "0.05em",
    marginTop: "0.2rem",
  },
  addBtn: {
    background: "var(--balloon-red)",
    border: "none",
    color: "var(--dirty-white)",
    fontFamily: "var(--font-horror)",
    fontSize: "0.9rem",
    letterSpacing: "0.15em",
    padding: "0.6rem 1.2rem",
    cursor: "pointer",
    borderRadius: 0,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  statCard: {
    background: "var(--card-bg)",
    border: "1px solid var(--border)",
    padding: "1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
  },
  statLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    color: "var(--muted)",
    letterSpacing: "0.15em",
  },
  statValue: {
    fontFamily: "var(--font-horror)",
    fontSize: "1.8rem",
    color: "var(--dirty-white)",
    letterSpacing: "0.05em",
    lineHeight: 1,
  },
  statTag: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    color: "var(--muted)",
  },
  formPanel: {
    background: "var(--card-bg)",
    border: "1px solid var(--border)",
    borderLeft: "2px solid var(--crimson)",
    padding: "1.25rem",
    marginBottom: "1.25rem",
  },
  formPanelHeader: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.75rem",
    marginBottom: "1rem",
    paddingBottom: "0.75rem",
    borderBottom: "1px solid var(--border)",
  },
  panelTitle: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.7rem",
    color: "var(--muted)",
    letterSpacing: "0.15em",
  },
  panelSubtitle: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    color: "var(--crimson)",
  },
  typeToggle: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1rem",
    flexWrap: "wrap",
  },
  typeBtn: {
    background: "transparent",
    border: "1px solid var(--border)",
    color: "var(--muted)",
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    letterSpacing: "0.1em",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  typeBtnExpenseActive: {
    borderColor: "var(--crimson)",
    color: "var(--balloon-red)",
    background: "rgba(139,0,0,0.15)",
  },
  typeBtnIncomeActive: {
    borderColor: "#1a4a1a",
    color: "#4caf50",
    background: "rgba(10,42,10,0.3)",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "1rem",
    marginBottom: "1rem",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.6rem",
    color: "var(--muted)",
    letterSpacing: "0.15em",
  },
  input: {
    background: "var(--dark-bg)",
    border: "1px solid var(--border)",
    color: "var(--dirty-white)",
    fontFamily: "var(--font-mono)",
    fontSize: "0.85rem",
    padding: "0.6rem 0.75rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    borderRadius: 0,
    colorScheme: "dark",
  },
  select: {
    background: "var(--dark-bg)",
    border: "1px solid var(--border)",
    color: "var(--dirty-white)",
    fontFamily: "var(--font-mono)",
    fontSize: "0.8rem",
    padding: "0.6rem 0.75rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    borderRadius: 0,
    cursor: "pointer",
    colorScheme: "dark",
  },
  errorMsg: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.7rem",
    color: "var(--balloon-red)",
    marginBottom: "0.75rem",
    letterSpacing: "0.05em",
  },
  submitBtn: {
    width: "100%",
    background: "transparent",
    border: "1px solid var(--crimson)",
    color: "var(--balloon-red)",
    fontFamily: "var(--font-horror)",
    fontSize: "1rem",
    letterSpacing: "0.2em",
    padding: "0.75rem",
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s",
  },
  panel: {
    background: "var(--card-bg)",
    border: "1px solid var(--border)",
  },
  tableHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0.6rem 1.25rem",
    borderBottom: "1px solid var(--border)",
    background: "var(--sewer-black)",
  },
  colHeader: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.6rem",
    color: "var(--muted)",
    letterSpacing: "0.15em",
  },
  txRow: {
    display: "flex",
    alignItems: "center",
    padding: "0.85rem 1.25rem",
    borderBottom: "1px solid var(--border)",
    gap: "0.75rem",
  },
  txCell: {
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
    minWidth: 0,
  },
  typePill: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.55rem",
    letterSpacing: "0.1em",
    padding: "0.15rem 0.4rem",
    border: "1px solid",
    flexShrink: 0,
  },
  txName: {
    fontFamily: "var(--font-body)",
    fontSize: "0.85rem",
    color: "var(--dirty-white)",
    fontWeight: 500,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  txNote: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    color: "var(--muted)",
    textTransform: "capitalize",
  },
  txFreq: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.72rem",
    color: "var(--muted)",
  },
  txDate: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.72rem",
    color: "var(--muted)",
  },
  txAmount: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.9rem",
    fontWeight: 600,
    letterSpacing: "0.05em",
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "var(--muted)",
    fontSize: "0.7rem",
    cursor: "pointer",
    padding: "0.25rem",
    lineHeight: 1,
  },
  empty: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.75rem",
    color: "var(--muted)",
    textAlign: "center",
    padding: "3rem 0",
  },
};

export default TheRitual;