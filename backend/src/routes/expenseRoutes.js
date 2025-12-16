import express from "express";
import Expense from "../models/Expense.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id })
      .sort({ createdAt: 1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { expenses } = req.body;

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    await Expense.deleteMany({
      user: req.user.id,
      month,
      year
    });

    const docs = expenses.map(i => ({
      user: req.user.id,
      name: i.name,
      value: i.value,
      month,
      year
    }));

    const created = await Expense.insertMany(docs);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    await expense.deleteOne();
    res.json({ message: "Expense removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
