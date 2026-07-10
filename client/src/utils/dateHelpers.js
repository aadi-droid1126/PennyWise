export const toInputDate = (date) => new Date(date).toISOString().split("T")[0];

export const fmtDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const fmtMonth = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });

export const startOfMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split("T")[0];
};

export const today = () => new Date().toISOString().split("T")[0];

export const daysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
};

export const isThisMonth = (date) => {
  const d = new Date(date);
  const now = new Date();
  return (
    d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  );
};
