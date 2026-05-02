const Transaction = require("../models/Transaction");
const Card = require("../models/Card");
const Cash = require("../models/Cash");

async function applyBalanceChange(transaction, reverse = false) {
  const amount = Number(transaction.amount);

  let change = transaction.type === "income" ? amount : -amount;

  if (reverse) {
    change = -change;
  }

  if (transaction.source === "card") {
    if (!transaction.cardId) {
      throw new Error("cardId is required for card transactions");
    }

    await Card.findByIdAndUpdate(transaction.cardId, {
      $inc: { balance: change },
    });
  }

  if (transaction.source === "cash") {
    await Cash.findOneAndUpdate(
      { userId: transaction.userId },
      { $inc: { balance: change } },
      { new: true, upsert: true }
    );
  }
}

exports.importPdfTransactions = async (req, res) => {
  try {
    const { userId, cardId, source } = req.body;

    if (!userId || !source) {
      return res.status(400).json({ message: "userId and source are required" });
    }

    if (source === "card" && !cardId) {
      return res.status(400).json({ message: "cardId is required for card import" });
    }

    const simulatedTransactions = [
      {
        userId,
        cardId: source === "card" ? cardId : null,
        source,
        type: "expense",
        amount: 35,
        category: "Food",
        description: "Simulated restaurant transaction",
      },
      {
        userId,
        cardId: source === "card" ? cardId : null,
        source,
        type: "expense",
        amount: 120,
        category: "Shopping",
        description: "Simulated shopping transaction",
      },
      {
        userId,
        cardId: source === "card" ? cardId : null,
        source,
        type: "income",
        amount: 500,
        category: "Allowance",
        description: "Simulated income transaction",
      },
    ];

    const transactions = await Transaction.insertMany(simulatedTransactions);

    for (const transaction of transactions) {
      await applyBalanceChange(transaction);
    }

    res.status(201).json({
      message: "PDF import simulated successfully",
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to import transactions", error: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { userId } = req.query;

    const transactions = await Transaction.find(userId ? { userId } : {})
      .populate("cardId")
      .sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to get transactions", error: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await applyBalanceChange(transaction, true);
    await Transaction.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Transaction deleted and balance reversed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete transaction", error: error.message });
  }
};