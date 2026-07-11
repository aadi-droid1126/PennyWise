import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import PennywiseRoast from "../components/features/PennywiseRoast";
import StreakBadge from "../components/features/StreakBadge";
import BottomNav from "../components/BottomNav";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const [summaryRes, txRes] = await Promise.all([
        api.get(`/transactions/summary?month=${month}&year=${year}`),
        api.get("/transactions"),
      ]);
      setSummary(summaryRes.data);
      setTransactions(txRes.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const fmt = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

  const navItems = [
    { label: "The Lair", path: "/dashboard", icon: "⬡" },
    { label: "Losers' Log", path: "/transactions", icon: "≡" },
    { label: "Sewer Map", path: "/analytics", icon: "◎" },
    { label: "The Ritual", path: "/recurring", icon: "↻" },
    { label: "Escape Derry", path: "/goals", icon: "◈" },
    { label: "Case File", path: "/export", icon: "⊞" },
  ];

  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)" }} className="sidebar">
        <div style={styles.sidebarHeader}>
          <span style={styles.sidebarLogo}>PENNYWISE</span>
          <button style={styles.closeBtn} onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <nav style={styles.nav}>
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} style={styles.navItem} onClick={() => setSidebarOpen(false)}>
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div style={{ padding: "0 0.75rem", marginBottom: "0.5rem" }}>
          <PennywiseRoast context="dashboard" />
        </div>
        <button style={styles.logoutBtn} onClick={handleLogout}>EXIT THE SEWER</button>
      </aside>

      {sidebarOpen && <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      <div style={styles.main}>
        {/* Topbar */}
        <header style={styles.topbar}>
          <button style={styles.menuBtn} onClick={() => setSidebarOpen(true)}>☰</button>
          <div style={styles.topbarCenter}>
            <span style={styles.topbarLogo}>PENNYWISE</span>
          </div>
          <div style={styles.topbarRight}>
            <span style={styles.topbarUser}>{user?.name?.split(" ")[0] || "Loser"}</span>
          </div>
        </header>

        <div style={{ ...styles.content, paddingBottom: "76px" }}>
          {/* Page Header */}
          <div style={styles.pageHeader}>
            <div style={styles.pageHeaderLeft}>
              <div style={styles.redBar} />
              <div>
                <h1 style={styles.pageTitle}>THE LAIR</h1>
                <p style={styles.pageSubtitle}>Welcome back, {user?.name?.split(" ")[0]}. IT has been watching.</p>
              </div>
            </div>
            <button style={styles.addBtn} onClick={() => navigate("/transactions")}>
              + ADD FLOATER
            </button>
          </div>

          {/* Stats */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <span style={styles.statLabel}>BALANCE</span>
              <span style={styles.statValue}>{fmt(summary?.balance)}</span>
              <span style={styles.statTag}>Total left in the sewer</span>
            </div>
            <div style={{ ...styles.statCard, ...styles.statCardRed }}>
              <span style={styles.statLabel}>FLOATERS</span>
              <span style={{ ...styles.statValue, color: "var(--balloon-red)" }}>{fmt(summary?.expenses)}</span>
              <span style={styles.statTag}>Total expenses</span>
            </div>
            <div style={{ ...styles.statCard, ...styles.statCardGreen }}>
              <span style={styles.statLabel}>SURVIVORS</span>
              <span style={{ ...styles.statValue, color: "#4caf50" }}>{fmt(summary?.income)}</span>
              <span style={styles.statTag}>Total income</span>
            </div>
            <StreakBadge />
          </div>

          {/* Bottom Grid */}
          <div style={styles.bottomGrid}>
            {/* Recent Transactions */}
            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <span style={styles.panelTitle}>RECENT FLOATERS</span>
                <Link to="/transactions" style={styles.panelLink}>View all →</Link>
              </div>
              {transactions.length === 0 ? (
                <p style={styles.empty}>No floaters yet. The sewer is dry.</p>
              ) : (
                transactions.map((tx) => (
                  <div key={tx._id} style={styles.txRow}>
                    <div style={styles.txLeft}>
                      <span style={styles.txCategory}>{tx.category}</span>
                      <span style={styles.txNote}>{tx.note || tx.description || "—"}</span>
                    </div>
                    <span style={{ ...styles.txAmount, color: tx.type === "expense" ? "var(--balloon-red)" : "#4caf50" }}>
                      {tx.type === "expense" ? "-" : "+"}{fmt(tx.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Pennywise Speaks */}
            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <span style={styles.panelTitle}>PENNYWISE SPEAKS</span>
              </div>
              <p style={styles.roastDesc}>Let It analyze your spending and deliver a verdict.</p>
              <PennywiseRoast context="dashboard" />
            </div>
          </div>
        </div>
      </div>

      <BottomNav />

      <style>{`
        @media (min-width: 768px) {
          .sidebar {
            transform: translateX(0) !important;
            position: relative !important;
            width: 220px !important;
            flex-shrink: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  root: { minHeight: "100vh", display: "flex", background: "var(--dark-bg)", color: "var(--dirty-white)", position: "relative" },
  sidebar: { position: "fixed", top: 0, left: 0, bottom: 0, width: "220px", background: "var(--sewer-black)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", zIndex: 100, transition: "transform 0.3s ease", padding: "1.5rem 0" },
  sidebarHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.25rem 1.5rem", borderBottom: "1px solid var(--border)", marginBottom: "1rem" },
  sidebarLogo: { fontFamily: "var(--font-horror)", fontSize: "1.2rem", letterSpacing: "0.2em", color: "var(--balloon-red)" },
  closeBtn: { background: "none", border: "none", color: "var(--muted)", fontSize: "1rem", cursor: "pointer" },
  nav: { flex: 1, display: "flex", flexDirection: "column", padding: "0 0.75rem", gap: "0.25rem" },
  navItem: { display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 0.75rem", borderRadius: "2px", color: "var(--muted)", fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", transition: "color 0.2s, background 0.2s", textDecoration: "none" },
  navIcon: { fontSize: "1rem", width: "20px", textAlign: "center", color: "var(--crimson)" },
  logoutBtn: { margin: "0.5rem 0.75rem 0", background: "none", border: "1px solid var(--border)", color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.15em", padding: "0.6rem", cursor: "pointer" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 99 },
  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
  topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.25rem", height: "56px", borderBottom: "1px solid var(--border)", background: "var(--sewer-black)", position: "sticky", top: 0, zIndex: 50 },
  menuBtn: { background: "none", border: "none", color: "var(--dirty-white)", fontSize: "1.2rem", cursor: "pointer" },
  topbarCenter: { position: "absolute", left: "50%", transform: "translateX(-50%)" },
  topbarLogo: { fontFamily: "var(--font-horror)", fontSize: "1.1rem", letterSpacing: "0.2em", color: "var(--balloon-red)" },
  topbarRight: { display: "flex", alignItems: "center" },
  topbarUser: { fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" },
  content: { padding: "1.5rem", flex: 1 },
  pageHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" },
  pageHeaderLeft: { display: "flex", alignItems: "center", gap: "1rem" },
  redBar: { width: "3px", height: "36px", background: "var(--balloon-red)", flexShrink: 0 },
  pageTitle: { fontFamily: "var(--font-horror)", fontSize: "1.8rem", letterSpacing: "0.2em", color: "var(--dirty-white)", lineHeight: 1 },
  pageSubtitle: { fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.05em", marginTop: "0.2rem" },
  addBtn: { background: "var(--balloon-red)", border: "none", color: "var(--dirty-white)", fontFamily: "var(--font-horror)", fontSize: "0.9rem", letterSpacing: "0.15em", padding: "0.6rem 1.2rem", cursor: "pointer", borderRadius: 0 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" },
  statCard: { background: "var(--card-bg)", border: "1px solid var(--border)", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.3rem" },
  statCardRed: { borderColor: "#3a0000" },
  statCardGreen: { borderColor: "#0a2a0a" },
  statLabel: { fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)", letterSpacing: "0.15em" },
  statValue: { fontFamily: "var(--font-horror)", fontSize: "1.8rem", color: "var(--dirty-white)", letterSpacing: "0.05em", lineHeight: 1 },
  statTag: { fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" },
  bottomGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" },
  panel: { background: "var(--card-bg)", border: "1px solid var(--border)", padding: "1.25rem" },
  panelHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border)" },
  panelTitle: { fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.15em" },
  panelLink: { fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--crimson)", letterSpacing: "0.05em" },
  empty: { fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)", textAlign: "center", padding: "2rem 0" },
  txRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 0", borderBottom: "1px solid var(--border)" },
  txLeft: { display: "flex", flexDirection: "column", gap: "0.15rem" },
  txCategory: { fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--dirty-white)", fontWeight: 500, textTransform: "capitalize" },
  txNote: { fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--muted)" },
  txAmount: { fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 500 },
  roastDesc: { fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", marginBottom: "1rem", lineHeight: 1.6 },
};

export default Dashboard;