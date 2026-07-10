import api from "../services/api";

// Fetch AI roast from backend based on current page context
export const getPennywiseRoast = async (context) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const res = await api.post("/insights/roast", {
      month,
      year,
      context, // "dashboard" | "transactions" | "goals" | "ritual" | "export"
    });

    return res.data.roast;
  } catch (err) {
    // Fallback offline roasts per context
    const fallbacks = {
      dashboard: "Your finances are a horror show. Even I am entertained. 🎈",
      transactions:
        "Look at all these floaters... you've been busy drowning. 🎈",
      goals:
        "Escape from Derry? Cute. You cannot even escape your own spending. 🎈",
      ritual: "Recurring payments. They always come back. Just like me. 🎈",
      export:
        "Downloading your financial horror story. Even I would not read this. 🎈",
      budget: "A budget? How adorable. IT gives you two weeks. 🎈",
      exceeded: "Budget exceeded. The sewer overflows. You'll float too. 🎈",
      lowbalance: "Almost broke. The deadlights are dimming. 🎈",
      newexpense: "Another floater joins the sewer. IT is pleased. 🎈",
      goalcomplete: "You escaped... this time. But IT never truly lets go. 🎈",
    };
    return fallbacks[context] || fallbacks.dashboard;
  }
};

export default getPennywiseRoast;
