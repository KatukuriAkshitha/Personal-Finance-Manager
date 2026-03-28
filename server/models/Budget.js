import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: String,
  limit: Number,
});

export default mongoose.model("Budget", budgetSchema);