import { useState } from "react";
import jsPDF from "jspdf";
import api from "../services/api";
import Layout from "../components/Layout";
import PennywiseRoast from "../components/features/PennywiseRoast";

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

const TheCaseFile = () => {
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [pdfExporting, setPdfExporting] = useState(false);
  const [pdfDone, setPdfDone] = useState(false);

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

  const handlePdfExport = async () => {
    setPdfExporting(true);
    try {
      const { data: transactions } = await api.get("/transactions");

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const marginX = 40;
      let y = 50;

      doc.setFont("courier", "bold");
      doc.setFontSize(20);
      doc.setTextColor(139, 0, 0);
      doc.text("PENNYWISE — THE CASE FILE", marginX, y);
      y += 20;

      doc.setFont("courier", "normal");
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(`Generated ${new Date().toLocaleString("en-IN")}`, marginX, y);
      y += 25;

      const totalExpenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
      const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      doc.setTextColor(30, 30, 30);
      doc.setFontSize(10);
      doc.text(`Total Floaters (expenses): ${fmt(totalExpenses)}`, marginX, y);
      y += 14;
      doc.text(`Total Survivors (income): ${fmt(totalIncome)}`, marginX, y);
      y += 14;
      doc.text(`Net balance: ${fmt(totalIncome - totalExpenses)}`, marginX, y);
      y += 25;

      doc.setDrawColor(139, 0, 0);
      doc.line(marginX, y, pageWidth - marginX, y);
      y += 15;

      doc.setFont("courier", "bold");
      doc.setFontSize(9);
      doc.text("DATE", marginX, y);
      doc.text("TYPE", marginX + 80, y);
      doc.text("CATEGORY", marginX + 140, y);
      doc.text("NOTE", marginX + 260, y);
      doc.text("AMOUNT", pageWidth - marginX - 60, y);
      y += 8;
      doc.line(marginX, y, pageWidth - marginX, y);
      y += 15;

      doc.setFont("courier", "normal");
      doc.setFontSize(8.5);

      const sorted = [...transactions].sort(
        (a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
      );

      sorted.forEach((tx) => {
        if (y > 780) {
          doc.addPage();
          y = 50;
        }
        const dateStr = new Date(tx.date || tx.createdAt).toLocaleDateString("en-IN");
        const isExpense = tx.type === "expense";

        doc.setTextColor(30, 30, 30);
        doc.text(dateStr, marginX, y);
        doc.text(tx.type.toUpperCase(), marginX + 80, y);
        doc.text((tx.category || "—").slice(0, 18), marginX + 140, y);
        doc.text((tx.note || "—").slice(0, 24), marginX + 260, y);

        doc.setTextColor(isExpense ? 200 : 30, isExpense ? 30 : 140, isExpense ? 30 : 30);
        const amountText = `${isExpense ? "-" : "+"}${fmt(tx.amount)}`;
        doc.text(amountText, pageWidth - marginX - doc.getTextWidth(amountText), y);

        y += 14;
      });

      doc.save(`pennywise-case-file-${Date.now()}.pdf`);
      setPdfDone(true);
      setTimeout(() => setPdfDone(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setPdfExporting(false);
    }
  };

  return (
    <Layout>
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
          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <span style={styles.panelTitle}>EXPORT FORMATS</span>
            </div>
            <p style={styles.panelDesc}>Download a complete record of your floaters and survivors. Every rupee. Every mistake.</p>
            <div style={styles.exportMeta}>
              <div style={styles.metaRow}>
                <span style={styles.metaLabel}>INCLUDES</span>
                <span style={styles.metaValue}>Date, Type, Category, Amount, Note</span>
              </div>
              <div style={styles.metaRow}>
                <span style={styles.metaLabel}>CURRENCY</span>
                <span style={styles.metaValue}>₹ Indian Rupees</span>
              </div>
            </div>

            <button style={{ ...styles.exportBtn, opacity: exporting ? 0.6 : 1 }} onClick={handleExport} disabled={exporting}>
              {exporting ? "PREPARING FILE..." : exportDone ? "CSV DOWNLOADED ✓" : "DOWNLOAD AS CSV"}
            </button>

            <button
              style={{ ...styles.exportBtnOutline, opacity: pdfExporting ? 0.6 : 1 }}
              onClick={handlePdfExport}
              disabled={pdfExporting}
            >
              {pdfExporting ? "PREPARING FILE..." : pdfDone ? "PDF DOWNLOADED ✓" : "DOWNLOAD AS PDF"}
            </button>
          </div>

          <div style={styles.panel}>
            <div style={styles.panelHeader}>
              <span style={styles.panelTitle}>PENNYWISE SPEAKS</span>
            </div>
            <p style={styles.panelDesc}>Summon IT for a full verdict on your financial wreckage. Hear the verdict spoken aloud.</p>
            <PennywiseRoast context="export" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  root: { minHeight: "100%", color: "var(--dirty-white)" },
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
  exportBtn: { background: "var(--balloon-red)", border: "none", color: "var(--dirty-white)", fontFamily: "var(--font-horror)", fontSize: "1rem", letterSpacing: "0.2em", padding: "0.85rem", cursor: "pointer", width: "100%" },
  exportBtnOutline: { background: "transparent", border: "1px solid var(--balloon-red)", color: "var(--balloon-red)", fontFamily: "var(--font-horror)", fontSize: "1rem", letterSpacing: "0.2em", padding: "0.85rem", cursor: "pointer", width: "100%", marginTop: "auto" },
};

export default TheCaseFile;
