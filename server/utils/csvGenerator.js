const generateCSV = (transactions) => {
  const headers = ["Date", "Type", "Category", "Amount", "Note", "Recurring"];

  const rows = transactions.map((t) => [
    new Date(t.date).toLocaleDateString("en-IN"),
    t.type,
    t.category,
    `₹${t.amount}`,
    t.note || "",
    t.isRecurring ? `Yes (${t.recurringInterval})` : "No",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  return csvContent;
};

module.exports = { generateCSV };
