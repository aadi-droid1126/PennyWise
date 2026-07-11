import { Link, useLocation, useNavigate } from "react-router-dom";

const items = [
    { label: "Lair", path: "/dashboard", icon: "⬡" },
    { label: "Log", path: "/transactions", icon: "≡" },
    { label: "Map", path: "/analytics", icon: "◎" },
    { label: "Ritual", path: "/recurring", icon: "↻" },
    { label: "Goals", path: "/goals", icon: "◈" },
];

const BottomNav = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <nav className="pw-bottomnav" style={styles.nav}>
            {items.slice(0, 2).map((item) => {
                const active = location.pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        style={{ ...styles.item, ...(active ? styles.itemActive : {}) }}
                    >
                        <span style={styles.icon}>{item.icon}</span>
                        <span style={styles.label}>{item.label}</span>
                    </Link>
                );
            })}

            <button style={styles.fab} onClick={() => navigate("/transactions")} aria-label="Add Floater">
                +
            </button>

            {items.slice(2).map((item) => {
                const active = location.pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        style={{ ...styles.item, ...(active ? styles.itemActive : {}) }}
                    >
                        <span style={styles.icon}>{item.icon}</span>
                        <span style={styles.label}>{item.label}</span>
                    </Link>
                );
            })}

            <style>{`
        @media (min-width: 768px) {
          .pw-bottomnav {
            display: none !important;
          }
        }
      `}</style>
        </nav>
    );
};

const styles = {
    nav: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "60px",
        background: "var(--sewer-black)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        zIndex: 90,
        paddingBottom: "env(safe-area-inset-bottom, 0)",
    },
    item: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.15rem",
        color: "var(--muted)",
        textDecoration: "none",
        fontFamily: "var(--font-mono)",
        fontSize: "0.55rem",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        flex: 1,
        padding: "0.4rem 0",
    },
    itemActive: {
        color: "var(--balloon-red)",
    },
    icon: {
        fontSize: "1.1rem",
        lineHeight: 1,
    },
    label: {
        fontSize: "0.55rem",
    },
    fab: {
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        background: "var(--balloon-red)",
        border: "none",
        color: "var(--dirty-white)",
        fontSize: "1.6rem",
        lineHeight: 1,
        cursor: "pointer",
        flexShrink: 0,
        marginTop: "-20px",
        boxShadow: "0 2px 12px rgba(255,23,68,0.5)",
    },
};

export default BottomNav;
