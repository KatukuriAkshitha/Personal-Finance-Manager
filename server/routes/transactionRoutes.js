const express = require("express");
const router = express.Router();
const {
  addTransaction,
  getTransactions,
} = require("../controllers/transactionController");

const authMiddleware = require("../middleware/authMiddleware");
const { deleteTransaction } = require("../controllers/transactionController");
const { updateTransaction } = require("../controllers/transactionController");
const { getSummary } = require("../controllers/transactionController");

router.post("/", authMiddleware, addTransaction);
router.get("/", authMiddleware, getTransactions);
router.delete("/:id", authMiddleware, deleteTransaction);
router.put("/:id", authMiddleware, updateTransaction);
router.get("/summary", authMiddleware, getSummary);

module.exports = router;