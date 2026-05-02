const Card = require("../models/Card");

exports.addCard = async (req, res) => {
  try {
    const { userId, cardNumber, cardName, balance } = req.body;

    if (!userId || !cardNumber) {
      return res.status(400).json({ message: "userId and cardNumber are required" });
    }

    const card = await Card.create({
      userId,
      cardNumber,
      cardName,
      balance: Number(balance) || 0,
    });

    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ message: "Failed to add card", error: error.message });
  }
};

exports.getCards = async (req, res) => {
  try {
    const { userId } = req.query;

    const cards = await Card.find(userId ? { userId } : {});
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: "Failed to get cards", error: error.message });
  }
};

exports.updateCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ message: "Failed to update card", error: error.message });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete card", error: error.message });
  }
};