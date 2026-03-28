const express = require("express");
const { setBudget, getBudgets } = require("../controllers/budgetController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, setBudget);
router.get("/", protect, getBudgets);

module.exports = router;