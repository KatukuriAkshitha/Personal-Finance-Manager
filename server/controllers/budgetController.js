import Budget from "../models/Budget.js";

// SET budget
export const setBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { user: req.user.id, category },
      { limit },
      { new: true, upsert: true }
    );

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET budgets
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};