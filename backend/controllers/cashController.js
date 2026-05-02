const Cash = require("../models/Cash");

exports.getCash = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    let cash = await Cash.findOne({ userId });

    if (!cash) {
      cash = await Cash.create({ userId, balance: 0 });
    }

    res.status(200).json(cash);
  } catch (error) {
    res.status(500).json({ message: "Failed to get cash", error: error.message });
  }
};

exports.updateCash = async (req, res) => {
  try {
    const { userId, balance } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const cash = await Cash.findOneAndUpdate(
      { userId },
      { balance: Number(balance) || 0 },
      { new: true, upsert: true }
    );

    res.status(200).json(cash);
  } catch (error) {
    res.status(500).json({ message: "Failed to update cash", error: error.message });
  }
};