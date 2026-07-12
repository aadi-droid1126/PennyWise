import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import PennywiseRoast from "../components/features/PennywiseRoast";
import { usePennywiseVoice } from "../context/PennywiseVoiceContext";

const CATEGORIES = ["food", "transport", "entertainment", "health", "shopping", "utilities", "rent", "salary", "freelance", "investment", "other"];

const LosersLog = () => {
  const { speak } = usePennywiseVoice();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [form, setForm] = useState({
    type: "expense", amount: "", category: "food", description: "", date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/transactions");
      setTransactions(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) { setError("Enter a valid amount."); return; }
    setSubmitting(true);
    try {
      await api.post("/transactions", { ...form, amount: Number(form.amount) });
      const wasExpense = form.type === "expense";
      setForm({ type: "expense", amount: "", category: "food", description: "", date: new Date().toISOString().split("T")[0] });
      setShowForm(false);
      await fetchTransactions();
      speak(wasExpense ? "newexpense" : "newincome");
    } catch (err) { setError(err?.response?.data?.message || "IT refused your entry."); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((tx) => tx._id !== id));
    } catch (err) { console.error(err); }
    finally { setDeleting(null); }
  };

  const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

  const filtered = transactions.filter((tx) => {
    if (filterType !== "all" && tx.type !== filterType) return false;
    if (filterCategory !== "all" && tx.category !== filterCategory) return false;
    return true;
  });

  return (
    <Layout>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <div style={styles.pageHeaderLeft}>
          <div style={styles.redBar} />
          <div>
            <h1 style={styles.pageTitle}>THE LOSERS' LOG</h1>
            <p style={styles.pageSubtitle}>Every floater. Every survivor. IT remembers them all.</p>
          </div>
        </div>
        <button style={styles.addBtn} onClick={() => { setShowForm((v) => !v); setError(""); }}>
          {showForm ? "✕ CANCEL" : "+ ADD FLOATER"}
        </button>
      </div>

      {/* Pennywise Roast */}
      <div style={{ marginBottom: "1.25rem" }}>
        <PennywiseRoast context="transactions" />
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <div style={styles.formPanel}>
          <div style={styles.formPanelHeader}>
            <span style={styles.panelTitle}>NEW ENTRY</span>
            <span style={styles.panelSubtitle}>Feed the sewer.</span>
          </div>
          <div style={styles.typeToggle}>
            <button style={{ ...styles.typeBtn, ...(form.type === "expense" ? styles.typeBtnExpenseActive : {}) }} onClick={() => setForm((f) => ({ ...f, type: "expense" }))}>FLOATER (EXPENSE)</button>
            <button style={{ ...styles.typeBtn, ...(form.type === "income" ? styles.typeBtnIncomeActive : {}) }} onClick={() => setForm((f) => ({ ...f, type: "income" }))}>SURVIVOR (INCOME)</button>
          </div>
          <div style={styles.formGrid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>AMOUNT (₹)</label>
              <input type="number" min="0" placeholder="0" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} style={styles.input} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>FEAR (CATEGORY)</label>
              <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} style={styles.select}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>DATE</label>
              <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} style={styles.input} />
            </div>
            <div style={{ ...styles.fieldGroup, gridColumn: "1 / -1" }}>
              <label style={styles.label}>NOTE (WHY DID I BUY THIS?)</label>
              <input type="text" placeholder="Describe your sin..." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} style={styles.input} />
            </div>
          </div>
          {error && <p style={styles.errorMsg}>{error}</p>}
          <button style={{ ...styles.submitBtn, opacity: submitting ? 0.6 : 1 }} onClick={handleSubmit} disabled={submitting}>
            {submitting ? "FEEDING IT..." : "CAST INTO THE SEWER"}
          </button>
        </div>
      )}

      {/* Filters */}
      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>TYPE</span>
          <div style={styles.filterBtns}>
            {["all", "expense", "income"].map((t) => (
              <button key={t} style={{ ...styles.filterBtn, ...(filterType === t ? styles.filterBtnActive : {}) }} onClick={() => setFilterType(t)}>
                {t === "all" ? "ALL" : t === "expense" ? "FLOATERS" : "SURVIVORS"}
              </button>
            ))}
          </div>
        </div>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>FEAR</span>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ ...styles.select, width: "auto", minWidth: "120px" }}>
            <option value="all">All Fears</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>
        <span style={styles.filterCount}>{filtered.length} ENTR{filtered.length === 1 ? "Y" : "IES"}</span>
      </div>

      {/* Transaction List */}
      <div style={styles.panel}>
        {loading ? (
          <p style={styles.empty}>IT is retrieving the records...</p>
        ) : filtered.length === 0 ? (
          <p style={styles.empty}>{transactions.length === 0 ? "No entries yet. The sewer is dry." : "No entries match your filters."}</p>
        ) : (
          <div>
            <div style={styles.tableHeader}>
              <span style={{ ...styles.colHeader, flex: 2 }}>CATEGORY / NOTE</span>
              <span style={{ ...styles.colHeader, flex: 1 }}>DATE</span>
              <span style={{ ...styles.colHeader, flex: 1, textAlign: "right" }}>AMOUNT</span>
              <span style={{ ...styles.colHeader, width: "40px" }} />
            </div>
            {filtered.map((tx, i) => (
              <div key={tx._id} style={{ ...styles.txRow, ...(i === filtered.length - 1 ? { borderBottom: "none" } : {}) }}>
                <div style={{ ...styles.txCell, flex: 2 }}>
                  <div style={styles.txTopRow}>
                    <span style={{ ...styles.typePill, background: tx.type === "expense" ? "rgba(139,0,0,0.3)" : "rgba(10,42,10,0.5)", color: tx.type === "expense" ? "var(--balloon-red)" : "#4caf50", borderColor: tx.type === "expense" ? "#3a0000" : "#0a2a0a" }}>
                      {tx.type === "expense" ? "FLOATER" : "SURVIVOR"}
                    </span>
                    <span style={styles.txCategory}>{tx.category}</span>
                  </div>
                  {(tx.note || tx.description) && <span style={styles.txNote}>{tx.note || tx.description}</span>}
                </div>
                <div style={{ ...styles.txCell, flex: 1 }}>
                  <span style={styles.txDate}>{new Date(tx.date || tx.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
                <div style={{ ...styles.txCell, flex: 1, alignItems: "flex-end" }}>
                  <span style={{ ...styles.txAmount, color: tx.type === "expense" ? "var(--balloon-red)" : "#4caf50" }}>
                    {tx.type === "expense" ? "-" : "+"}{fmt(tx.amount)}
                  </span>
                </div>
                <div style={{ width: "40px", display: "flex", justifyContent: "flex-end" }}>
                  <button style={{ ...styles.deleteBtn, opacity: deleting === tx._id ? 0.4 : 1 }} onClick={() => handleDelete(tx._id)} disabled={deleting === tx._id} title="Delete">✕</button>
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
  pageHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" },
  pageHeaderLeft: { display: "flex", alignItems: "center", gap: "1rem" },
  redBar: { width: "3px", height: "36px", background: "var(--balloon-red)", flexShrink: 0 },
  pageTitle: { fontFamily: "var(--font-horror)", fontSize: "1.8rem", letterSpacing: "0.2em", color: "var(--dirty-white)", lineHeight: 1 },
  pageSubtitle: { fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.05em", marginTop: "0.2rem" },
  addBtn: { background: "var(--balloon-red)", border: "none", color: "var(--dirty-white)", fontFamily: "var(--font-horror)", fontSize: "0.9rem", letterSpacing: "0.15em", padding: "0.6rem 1.2rem", cursor: "pointer", borderRadius: 0 },
  formPanel: { background: "var(--card-bg)", border: "1px solid var(--border)", borderLeft: "2px solid var(--crimson)", padding: "1.25rem", marginBottom: "1.25rem" },
  formPanelHeader: { display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border)" },
  panelTitle: { fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.15em" },
  panelSubtitle: { fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--crimson)", letterSpacing: "0.05em" },
  typeToggle: { display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" },
  typeBtn: { background: "transparent", border: "1px solid var(--border)", color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.1em", padding: "0.5rem 1rem", cursor: "pointer" },
  typeBtnExpenseActive: { borderColor: "var(--crimson)", color: "var(--balloon-red)", background: "rgba(139,0,0,0.15)" },
  typeBtnIncomeActive: { borderColor: "#1a4a1a", color: "#4caf50", background: "rgba(10,42,10,0.3)" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1rem" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "0.4rem" },
  label: { fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", letterSpacing: "0.15em" },
  input: { background: "var(--dark-bg)", border: "1px solid var(--border)", color: "var(--dirty-white)", fontFamily: "var(--font-mono)", fontSize: "0.85rem", padding: "0.6rem 0.75rem", outline: "none", width: "100%", boxSizing: "border-box", borderRadius: 0, colorScheme: "dark" },
  select: { background: "var(--dark-bg)", border: "1px solid var(--border)", color: "var(--dirty-white)", fontFamily: "var(--font-mono)", fontSize: "0.8rem", padding: "0.6rem 0.75rem", outline: "none", width: "100%", boxSizing: "border-box", borderRadius: 0, cursor: "pointer", colorScheme: "dark" },
  errorMsg: { fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--balloon-red)", marginBottom: "0.75rem", letterSpacing: "0.05em" },
  submitBtn: { width: "100%", background: "transparent", border: "1px solid var(--crimson)", color: "var(--balloon-red)", fontFamily: "var(--font-horror)", fontSize: "1rem", letterSpacing: "0.2em", padding: "0.75rem", cursor: "pointer" },
  filterBar: { display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem", flexWrap: "wrap" },
  filterGroup: { display: "flex", alignItems: "center", gap: "0.6rem" },
  filterLabel: { fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", letterSpacing: "0.15em", flexShrink: 0 },
  filterBtns: { display: "flex", gap: "0.35rem" },
  filterBtn: { background: "transparent", border: "1px solid var(--border)", color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em", padding: "0.35rem 0.65rem", cursor: "pointer", borderRadius: 0 },
  filterBtnActive: { borderColor: "var(--crimson)", color: "var(--dirty-white)", background: "rgba(139,0,0,0.15)" },
  filterCount: { fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", letterSpacing: "0.1em", marginLeft: "auto" },
  panel: { background: "var(--card-bg)", border: "1px solid var(--border)" },
  tableHeader: { display: "flex", alignItems: "center", padding: "0.6rem 1.25rem", borderBottom: "1px solid var(--border)", background: "var(--sewer-black)" },
  colHeader: { fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--muted)", letterSpacing: "0.15em", textTransform: "uppercase" },
  txRow: { display: "flex", alignItems: "center", padding: "0.85rem 1.25rem", borderBottom: "1px solid var(--border)", gap: "0.75rem" },
  txCell: { display: "flex", flexDirection: "column", gap: "0.2rem", minWidth: 0 },
  txTopRow: { display: "flex", alignItems: "center", gap: "0.5rem" },
  typePill: { fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.1em", padding: "0.15rem 0.4rem", border: "1px solid", flexShrink: 0 },
  txCategory: { fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--dirty-white)", fontWeight: 500, textTransform: "capitalize", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  txNote: { fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  txDate: { fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)" },
  txAmount: { fontFamily: "var(--font-mono)", fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.05em" },
  deleteBtn: { background: "none", border: "none", color: "var(--muted)", fontSize: "0.7rem", cursor: "pointer", padding: "0.25rem", lineHeight: 1 },
  empty: { fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)", textAlign: "center", padding: "3rem 0" },
};

export default LosersLog;