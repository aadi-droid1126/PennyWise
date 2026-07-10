const Groq = require("groq-sdk");
const { buildRoastPrompt } = require("../utils/aiPromptBuilder");
const Transaction = require("../models/Transaction");

let groq;
const getGroq = () => {
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groq;
};

const getContextPrompt = (context) => {
  const prompts = {
    dashboard:
      "The user is viewing their main financial dashboard. Comment on their overall financial situation.",
    transactions:
      "The user is reviewing their transaction history — all their floaters in the sewer.",
    goals:
      "The user is checking their savings goals — their pitiful attempts to escape Derry.",
    ritual:
      "The user is reviewing their recurring expenses — the rituals they cannot escape.",
    export:
      "The user is downloading their financial records — their complete horror story.",
    budget:
      "The user just set a budget — their futile attempt to control their spending.",
    exceeded:
      "The user has EXCEEDED their budget. This is a moment of financial horror.",
    lowbalance: "The user is running very low on balance. The sewer is rising.",
    newexpense:
      "The user just added a new expense — another floater in the sewer.",
    goalcomplete:
      "The user just completed a savings goal — a rare escape from Derry.",
  };
  return prompts[context] || prompts.dashboard;
};

const insightController = async (req, res) => {
  try {
    const { month, year, context = "dashboard" } = req.body;
    const userId = req.user.id;

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    const transactions = await Transaction.find({
      userId,
      date: { $gte: start, $lte: end },
    });

    if (transactions.length === 0) {
      return res.json({
        roast:
          "No expenses this month? Either you are dead or lying. It suspects both. 🎈",
      });
    }

    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const byCategory = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const spendingData = {
      income,
      expenses,
      balance: income - expenses,
      byCategory,
    };
    const prompt = buildRoastPrompt(spendingData, req.user.name || "fool");
    const contextPrompt = getContextPrompt(context);

    const completion = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are Pennywise the Dancing Clown from Stephen King's It. You are terrifying, dramatic, darkly humorous and deeply unsettling. You speak in a chilling theatrical voice. ${contextPrompt} Keep response under 80 words. Never say "I T" as separate letters — always say "It" as one word. End with a chilling threat or taunt.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 1.2,
      max_tokens: 150,
    });

    const roast =
      completion.choices[0]?.message?.content ||
      "It is speechless. That is never good. 🎈";

    res.json({ roast });
  } catch (err) {
    res.status(500).json({
      message: "Pennywise is unavailable. Even It has limits.",
      error: err.message,
    });
  }
};

module.exports = { insightController };
