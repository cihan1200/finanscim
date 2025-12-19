import express from "express";
import MonthlyBalance from "../models/MonthlyBalance.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:year", protect, async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    let balanceDoc = await MonthlyBalance.findOne({
      user: req.user.id,
      year: year
    });
    if (!balanceDoc) {
      balanceDoc = await MonthlyBalance.create({
        user: req.user.id,
        year: year,
        balances: new Array(12).fill(0)
      });
    }
    res.json(balanceDoc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:year", protect, async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const { balances } = req.body;
    if (!balances || balances.length !== 12) {
      return res.status(400).json({ message: "Invalid balances data" });
    }
    const updatedDoc = await MonthlyBalance.findOneAndUpdate(
      { user: req.user.id, year: year },
      { balances: balances },
      { new: true, upsert: true }
    );
    res.json(updatedDoc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;