import { useStreak } from "../../hooks/useStreak";

const StreakBadge = () => {
    const { streak, loading } = useStreak();

    const broken = !loading && streak === 0;

    return (
        <div
            style={{
                background: "var(--card-bg)",
                border: `1px solid ${broken ? "#3a0000" : "var(--border)"}`,
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
            }}
        >
            <span
                style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    color: "var(--muted)",
                    letterSpacing: "0.15em",
                }}
            >
                DAYS SINCE IT APPEARED
            </span>
            <span
                style={{
                    fontFamily: "var(--font-horror)",
                    fontSize: "1.8rem",
                    color: broken ? "var(--balloon-red)" : "var(--dirty-white)",
                    letterSpacing: "0.05em",
                    lineHeight: 1,
                }}
            >
                {loading ? "—" : streak}
            </span>
            <span
                style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    color: broken ? "var(--balloon-red)" : "var(--muted)",
                }}
            >
                {loading
                    ? "Counting the days..."
                    : broken
                        ? "The streak is broken. IT is watching."
                        : streak === 1
                            ? "One day of peace in Derry."
                            : "Consecutive days logged."}
            </span>
        </div>
    );
};

export default StreakBadge;
