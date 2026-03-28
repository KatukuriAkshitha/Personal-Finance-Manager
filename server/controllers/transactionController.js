const Transaction = require("../models/Transaction");

// ADD TRANSACTION
exports.addTransaction = async (req, res) => {
  try {
    console.log("USER:", req.user);
    const { amount, category, type } = req.body;
    const newTransaction = new Transaction({
      userId: req.user.id,   // 🔥 IMPORTANT
      amount,
      category,
      type,
    });

    await newTransaction.save();

    res.json(newTransaction);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL TRANSACTIONS
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.id,
    });

    res.json(transactions);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//delete transactions
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // 🔐 check if user owns this transaction
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await transaction.deleteOne();

    res.json({ message: "Transaction deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//update transactions
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // 🔐 check ownership
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { amount, type, category } = req.body;

    transaction.amount = amount || transaction.amount;
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;

    await transaction.save();

    res.json({
      message: "Transaction updated successfully",
      transaction,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });

    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    });

    res.json({
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};