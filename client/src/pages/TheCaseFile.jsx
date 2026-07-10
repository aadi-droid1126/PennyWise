import { useState } from "react";
import api from "../services/api";
import PennywiseRoast from "../components/features/PennywiseRoast";

const TheCaseFile = () => {
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await api.get("/export/csv", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `pennywise-case-file-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setExportDone(true);
      setTimeout(() => setExportDone(false), 3000);
    } catch (err) { console.error(err); }
    finally { setExporting(false); }
  };

  return (
    <div style={styles.root}>
      <div style={styles.pageHeader}>
        <div style={styles.pageHeaderLeft}>
          <div style={styles.redBar} />
          <div>
            <h1 style={styles.pageTitle}>THE CASE FILE</h1>
            <p style={styles.pageSubtitle}>Export your sins. Let the record show what IT already knows.</p>
          </div>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Export Panel */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={styles.panelTitle}>CSV EXPORT</span>
          </div>
          <p style={styles.panelDesc}>Download a complete record of your floaters and survivors. Every rupee. Every mistake.</p>
          <div style={styles.exportMeta}>
            <div style={styles.metaRow}>
              <span style={styles.metaLabel}>FORMAT</span>
              <span style={styles.metaValue}>CSV (UTF-8)</span>
            </div>
            <div style={styles.metaRow}>
              <span style={styles.metaLabel}>INCLUDES</span>
              <span style={styles.metaValue}>Date, Type, Category, Amount, Description</span>
            </div>
            <div style={styles.metaRow}>
              <span style={styles.metaLabel}>CURRENCY</span>
              <span style={styles.metaValue}>₹ Indian Rupees</span>
            </div>
          </div>
          <button style={{ ...styles.exportBtn, opacity: exporting ? 0.6 : 1 }} onClick={handleExport} disabled={exporting}>
            {exporting ? "PREPARING FILE..." : exportDone ? "FILE DOWNLOADED ✓" : "DOWNLOAD CASE FILE"}
          </button>
        </div>

        {/* Pennywise Speaks Panel — with voice built in */}
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={styles.panelTitle}>PENNYWISE SPEAKS</span>
          </div>
          <p style={styles.panelDesc}>Summon IT for a full verdict on your financial wreckage. Hear the verdict spoken aloud.</p>
          <PennywiseRoast context="export" />
        </div>
      </div>
    </div>
  );
};

const styles = {
  root: { padding: "1.5rem", minHeight: "100vh", background: "var(--dark-bg)", color: "var(--dirty-white)" },
  pageHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" },
  pageHeaderLeft: { display: "flex", alignItems: "center", gap: "1rem" },
  redBar: { width: "3px", height: "36px", background: "var(--balloon-red)", flexShrink: 0 },
  pageTitle: { fontFamily: "var(--font-horror)", fontSize: "1.8rem", letterSpacing: "0.2em", color: "var(--dirty-white)", lineHeight: 1 },
  pageSubtitle: { fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.05em", marginTop: "0.2rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" },
  panel: { background: "var(--card-bg)", border: "1px solid var(--border)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" },
  panelHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border)" },
  panelTitle: { fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)", letterSpacing: "0.15em" },
  panelDesc: { fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.7 },
  exportMeta: { display: "flex", flexDirection: "column", gap: "0.5rem", background: "var(--sewer-black)", padding: "1rem", border: "1px solid var(--border)" },
  metaRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" },
  metaLabel: { fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)", letterSpacing: "0.1em", flexShrink: 0 },
  metaValue: { fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--dirty-white)", textAlign: "right" },
  exportBtn: { background: "var(--balloon-red)", border: "none", color: "var(--dirty-white)", fontFamily: "var(--font-horror)", fontSize: "1rem", letterSpacing: "0.2em", padding: "0.85rem", cursor: "pointer", width: "100%", marginTop: "auto" },
};

export default TheCaseFile;