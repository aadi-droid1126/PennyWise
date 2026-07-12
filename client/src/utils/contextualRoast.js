import api from "../services/api";

const fallbacks = {
  dashboard: [
    "Your finances are a horror show. Even I am entertained. 🎈",
    "Welcome back to the sewer. IT missed watching your spending.",
    "Every dashboard visit brings you closer to the deadlights of debt.",
    "Look who came crawling back to check the damage.",
    "I've been down here counting your rupees. There are fewer than yesterday.",
    "The Lair remembers everything you've spent. Every. Single. Rupee.",
    "You keep coming back. Moths to a flame. Losers to a ledger.",
    "Step closer. Let IT show you where your money really went.",
    "Another visit. Another chance for me to remind you: you're bad with money.",
    "The balance changes, but the fear stays the same. I like that about you.",
  ],
  transactions: [
    "Look at all these floaters... you've been busy drowning. 🎈",
    "Each transaction is a little balloon, floating down here with the others.",
    "So many floaters. IT is practically overflowing with joy.",
    "Every entry in this log is a tiny scream I can still hear.",
    "You log your sins so faithfully. Almost like a confession booth.",
    "I read your transactions the way children read comics. With delight.",
    "Some of these purchases were mistakes. Most of them, actually.",
    "Keep feeding the log. IT keeps score, even if you don't.",
    "This log is a museum of poor decisions. Curated by you.",
  ],
  goals: [
    "Escape from Derry? Cute. You cannot even escape your own spending. 🎈",
    "A goal. How optimistic. IT has seen this before.",
    "You want to escape? First you have to stop feeding IT.",
    "Dreams of escape are the sweetest kind. They rarely come true.",
    "Set your target. Watch it drift further away with every floater.",
    "A savings goal is just a promise you make to disappoint yourself later.",
    "Everyone plans their escape. Few ever leave the sewer.",
    "I do enjoy watching hope curdle into habit.",
  ],
  ritual: [
    "Recurring payments. They always come back. Just like me. 🎈",
    "The Ritual never ends. Neither does IT.",
    "Every 30 days, IT rises again. So does this bill.",
    "Bind it to the schedule. Bind yourself to the cycle.",
    "Some rituals summon demons. Yours just summons debt.",
    "The clock resets, the bill returns. A perfect, endless loop.",
    "You'll forget about this payment. IT never will.",
  ],
  export: [
    "Downloading your financial horror story. Even I would not read this. 🎈",
    "A case file. Evidence of your descent into the sewer.",
    "Print it if you dare. Some horrors are better left digital.",
    "Every rupee, documented. A confession in spreadsheet form.",
    "Take the file. Study it. Weep if you must.",
    "This is your paper trail into the deadlights.",
  ],
  budget: [
    "A budget? How adorable. IT gives you two weeks. 🎈",
    "Setting limits. IT finds that amusing.",
    "A budget is just a promise you're about to break.",
    "Boundaries are for people who intend to keep them.",
    "You've drawn a line. I've already seen you cross it.",
  ],
  exceeded: [
    "Budget exceeded. The sewer overflows. You'll float too. 🎈",
    "You've gone over. IT is very, very pleased.",
    "Limits were meant to be broken. Yours just were.",
    "Congratulations, you've officially disappointed the spreadsheet.",
    "The line you drew? Gone. Swept away like everything else down here.",
  ],
  lowbalance: [
    "Almost broke. The deadlights are dimming. 🎈",
    "Your balance is fading. So is your control down here.",
    "Running low. IT can smell the desperation.",
    "Careful now. There's not much left to float away.",
    "The sewer runs dry when you do. Interesting timing.",
  ],
  newexpense: [
    "Another floater joins the sewer. IT is pleased. 🎈",
    "A new expense. Welcome to the collection.",
    "One more balloon added to the drain.",
    "Logged and lost. Just like the rupees themselves.",
    "That's one more thing you didn't need. IT appreciates the offering.",
    "A fresh floater, still warm. My favorite kind.",
  ],
  newincome: [
    "A survivor arrives. Don't get used to keeping it. 🎈",
    "Income logged. IT is already planning where it goes.",
    "New money in the sewer. It won't last long down here.",
    "Every survivor eventually becomes a floater. Give it time.",
  ],
  goalcomplete: [
    "You escaped... this time. But IT never truly lets go. 🎈",
    "A goal complete. Don't get comfortable up there.",
    "You made it out. For now. IT will wait.",
    "Impressive. Most losers never make it this far.",
    "The balloon is full. Savor it — I'll be back for the next one.",
  ],
};

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Fetch AI roast from backend based on current page context
export const getPennywiseRoast = async (context) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const res = await api.post("/insights/roast", {
      month,
      year,
      context,
    });

    return res.data.roast;
  } catch (err) {
    const pool = fallbacks[context] || fallbacks.dashboard;
    return pickRandom(pool);
  }
};

export default getPennywiseRoast;
