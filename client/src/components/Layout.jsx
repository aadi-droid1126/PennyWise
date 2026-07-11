import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BottomNav from "./BottomNav";

const navItems = [
  { label: "The Lair", path: "/dashboard", icon: "⬡" },
  { label: "Losers' Log", path: "/transactions", icon: "≡" },
  { label: "Sewer Map", path: "/analytics", icon: "◎" },
  { label: "The Ritual", path: "/recurring", icon: "↻" },
  { label: "Escape From Derry", path: "/goals", icon: "◈" },
  { label: "Case File", path: "/export", icon: "⊞" },
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div style={styles.root}>
      <aside
        className="pw-sidebar"
        style={{
          ...styles.sidebar,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div style={styles.sidebarHeader}>
          <span style={styles.sidebarLogo}>PENNYWISE</span>
          <button style={styles.closeBtn} onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>

        <nav style={styles.nav}>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.navItem,
                  ...(active ? styles.navItemActive : {}),
                }}
                onClick={() => setSidebarOpen(false)}
              >
                <span
                  style={{
                    ...styles.navIcon,
                    color: active ? "var(--balloon-red)" : "var(--crimson)",
                  }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {active && <div style={styles.activeBar} />}
              </Link>
            );
          })}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.sidebarUser}>
            <span style={styles.sidebarUserLabel}>LOGGED IN AS</span>
            <span style={styles.sidebarUserName}>
              {user?.name?.toUpperCase() || "LOSER"}
            </span>
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            EXIT THE SEWER
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <div style={styles.main}>
        <header style={styles.topbar}>
          <button
            style={styles.menuBtn}
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <div style={styles.topbarCenter}>
            <span style={styles.topbarLogo}>PENNYWISE</span>
          </div>
          <div style={styles.topbarRight}>
            <span style={styles.topbarUser}>
              {user?.name?.split(" ")[0]?.toUpperCase() || "LOSER"}
            </span>
          </div>
        </header>

        <div style={{ ...styles.content, paddingBottom: "76px" }}>{children}</div>
      </div>

      <BottomNav />

      <style>{`
        @media (min-width: 768px) {
          .pw-sidebar {
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
  root: {
    minHeight: "100vh",
    display: "flex",
    background: "var(--dark-bg)",
    color: "var(--dirty-white)",
    position: "relative",
  },
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    width: "220px",
    background: "var(--sewer-black)",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    zIndex: 100,
    transition: "transform 0.3s ease",
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1.5rem 1.25rem 1.25rem",
    borderBottom: "1px solid var(--border)",
  },
  sidebarLogo: {
    fontFamily: "var(--font-horror)",
    fontSize: "1.2rem",
    letterSpacing: "0.2em",
    color: "var(--balloon-red)",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "var(--muted)",
    fontSize: "1rem",
    cursor: "pointer",
    lineHeight: 1,
  },
  nav: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "1rem 0.75rem",
    gap: "0.2rem",
    overflowY: "auto",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.65rem 0.75rem",
    borderRadius: "2px",
    color: "var(--muted)",
    fontFamily: "var(--font-body)",
    fontSize: "0.8rem",
    fontWeight: 500,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    textDecoration: "none",
    transition: "color 0.2s, background 0.2s",
    position: "relative",
  },
  navItemActive: {
    color: "var(--dirty-white)",
    background: "rgba(139,0,0,0.15)",
  },
  navIcon: {
    fontSize: "1rem",
    width: "20px",
    textAlign: "center",
    flexShrink: 0,
  },
  activeBar: {
    position: "absolute",
    left: 0,
    top: "20%",
    bottom: "20%",
    width: "2px",
    background: "var(--balloon-red)",
    borderRadius: "0 2px 2px 0",
  },
  sidebarFooter: {
    padding: "1rem 0.75rem 1.5rem",
    borderTop: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  sidebarUser: {
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
    padding: "0 0.25rem",
  },
  sidebarUserLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.55rem",
    color: "var(--muted)",
    letterSpacing: "0.15em",
  },
  sidebarUserName: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.72rem",
    color: "var(--dirty-white)",
    letterSpacing: "0.1em",
  },
  logoutBtn: {
    background: "none",
    border: "1px solid var(--border)",
    color: "var(--muted)",
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    letterSpacing: "0.15em",
    padding: "0.6rem",
    cursor: "pointer",
    transition: "border-color 0.2s, color 0.2s",
    width: "100%",
    textAlign: "center",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    zIndex: 99,
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 1.25rem",
    height: "56px",
    borderBottom: "1px solid var(--border)",
    background: "var(--sewer-black)",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  menuBtn: {
    background: "none",
    border: "none",
    color: "var(--dirty-white)",
    fontSize: "1.2rem",
    cursor: "pointer",
    lineHeight: 1,
  },
  topbarCenter: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
  },
  topbarLogo: {
    fontFamily: "var(--font-horror)",
    fontSize: "1.1rem",
    letterSpacing: "0.2em",
    color: "var(--balloon-red)",
  },
  topbarRight: {
    display: "flex",
    alignItems: "center",
  },
  topbarUser: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.72rem",
    color: "var(--muted)",
    letterSpacing: "0.1em",
  },
  content: {
    flex: 1,
    padding: "1.5rem",
    overflowY: "auto",
  },
};

export default Layout;