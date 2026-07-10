import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from "recharts";
import Layout from "../components/Layout";
import api from "../services/api";
import { fmt } from "../utils/formatters";
import { fmtMonth } from "../utils/dateHelpers";
import PennywiseRoast from "../components/features/PennywiseRoast";

const COLORS = ["#8B0000", "#CC0000", "#ff4444", "#ff7700", "#ffaa00", "#4caf50", "#00bcd4", "#9c27b0", "#ff69b4", "#795548", "#607d8b"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", padding: "0.75rem 1rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--dirty-white)" }}>
      {label && <p style={{ color: "var(--muted)", marginBottom: "0.35rem" }}>{label}</p>}
      {payload.map((p, i) => <p key={i} style={{ color: p.color }}>{p.name}: {fmt(p.value)}</p>)}
    </div>
  );
};

const SewerMap = () => {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const [sumRes, txRes] = await Promise.all([
        api.get(`/transactions/summary?month=${month}&year=${year}`),
        api.get("/transactions"),
      ]);
      setSummary(sumRes.data);
      setTransactions(txRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const pieData = summary?.byCategory
    ? Object.entries(summary.byCategory).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))
    : [];

  const monthMap = {};
  transactions.forEach((tx) => {
    const month = fmtMonth(tx.date || tx.createdAt);
    if (!monthMap[month]) monthMap[month] = { month, income: 0, expenses: 0 };
    if (tx.type === "income") monthMap[month].income += tx.amount;
    else monthMap[month].expenses += tx.amount;
  });
  const barData = Object.values(monthMap).slice(-6);

  const sorted = [...transactions].sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt));
  let running = 0;
  const lineData = sorted.map((tx) => {
    running += tx.type === "income" ? tx.amount : -tx.amount;
    return { date: fmtMonth(tx.date || tx.createdAt), balance: running };
  });

  return (
    <Layout>
      <div style={styles.pageHeader}>
        <div style={styles.pageHeaderLeft}>
          <div style={styles.redBar} />
          <div>
            <h1 style={styles.pageTitle}>THE SEWER MAP</h1>
            <p style={styles.pageSubtitle}>IT has charted your descent. Every rupee accounted for.</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <PennywiseRoast context="dashboard" />
      </div>

      {loading ? (
        <p style={styles.empty}>IT is mapping the sewer...</p>
      ) : transactions.length === 0 ? (
        <p style={styles.empty}>No data yet. The sewer is unmapped.</p>
      ) : (
        <>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <span style={styles.statLabel}>TOTAL INCOME</span>
              <span style={{ ...styles.statValue, color: "#4caf50" }}>{fmt(summary?.income)}</span>
              <span style={styles.statTag}>Survivors collected</span>
            </div>
            <div style={{ ...styles.statCard, borderColor: "#3a0000" }}>
              <span style={styles.statLabel}>TOTAL EXPENSES</span>
              <span style={{ ...styles.statValue, color: "var(--balloon-red)" }}>{fmt(summary?.expenses)}</span>
              <span style={styles.statTag}>Floaters lost</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statLabel}>NET BALANCE</span>
              <span style={{ ...styles.statValue, color: summary?.balance >= 0 ? "#4caf50" : "var(--balloon-red)" }}>{fmt(summary?.balance)}</span>
              <span style={styles.statTag}>What IT left you with</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statLabel}>BIGGEST FEAR</span>
              <span style={{ ...styles.statValue, fontSize: "1.2rem", textTransform: "capitalize" }}>
                {pieData.sort((a, b) => b.value - a.value)[0]?.name || "—"}
              </span>
              <span style={styles.statTag}>Top spending category</span>
            </div>
          </div>

          <div style={styles.chartsGrid}>
            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <span style={styles.panelTitle}>FEARS BREAKDOWN</span>
                <span style={styles.panelSub}>Expenses by category</span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={styles.legend}>
                {pieData.map((entry, i) => (
                  <div key={i} style={styles.legendItem}>
                    <div style={{ width: "8px", height: "8px", background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                    <span style={styles.legendLabel}>{entry.name}</span>
                    <span style={styles.legendValue}>{fmt(entry.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <span style={styles.panelTitle}>MONTHLY CARNAGE</span>
                <span style={styles.panelSub}>Income vs Expenses</span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--muted)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                  <YAxis tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}K` : v}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" }} />
                  <Bar dataKey="income" name="Survivors" fill="#4caf50" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="expenses" name="Floaters" fill="var(--crimson)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ ...styles.panel, marginTop: "1rem" }}>
            <div style={styles.panelHeader}>
              <span style={styles.panelTitle}>THE DESCENT</span>
              <span style={styles.panelSub}>Running balance over time</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--muted)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
                <YAxis tick={{ fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}K` : v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="balance" name="Balance" stroke="var(--balloon-red)" strokeWidth={2} dot={{ fill: "var(--balloon-red)", r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Layout>
  );
};

const styles = {
  pageHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" },
  pageHeaderLeft: { display: "flex", alignItems: "center", gap: "1rem" },
  redBar: { width: "3px", height: "36px", background: "var(--balloon-red)", flexShrink: 0 },
  pageTitle: { fontFamily: "var(--font-horror)", fontSize: "1.8rem", letterSpacing: "0.2em", color: "var(--dirty-white)", lineHeight: 1 },
  pageSubtitle: { fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.05em", marginTop: "0.2rem" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1.5rem" },
  statCard: { background: "var(--card-bg)", border: "1px solid var(--border)", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.3rem" },
  statLabel: { fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.15em" },
  statValue: { fontFamily: "var(--font-horror)", fontSize: "1.8rem", color: "var(--dirty-white)", letterSpacing: "0.05em", lineHeight: 1 },
  statTag: { fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" },
  chartsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" },
  panel: { background: "var(--card-bg)", border: "1px solid var(--border)", padding: "1.25rem" },
  panelHeader: { display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border)" },
  panelTitle: { fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.15em" },
  panelSub: { fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--crimson)" },
  legend: { display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "0.75rem", maxHeight: "120px", overflowY: "auto" },
  legendItem: { display: "flex", alignItems: "center", gap: "0.5rem" },
  legendLabel: { fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)", flex: 1 },
  legendValue: { fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--dirty-white)" },
  empty: { fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)", textAlign: "center", padding: "4rem 0" },
};

export default SewerMap;