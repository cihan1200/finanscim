import express from "express";
import Income from "../models/Income.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user.id }).sort({ createdAt: 1 });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { incomes } = req.body;
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    await Income.deleteMany({
      user: req.user.id,
      month,
      year
    });
    const docs = incomes.map(i => ({
      user: req.user.id,
      name: i.name,
      value: i.value,
      month,
      year
    }));
    const created = await Income.insertMany(docs);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }
    await income.deleteOne();
    res.json({ message: "Income removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
