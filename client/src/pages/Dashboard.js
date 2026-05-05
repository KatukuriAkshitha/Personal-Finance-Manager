import { useEffect, useState } from "react";
import API from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");
  const [loading, setLoading] = useState(true);

  // ✅ Budget States
  const [budgetCategory, setBudgetCategory] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await API.get("/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransactions(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/budget", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBudgets(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addTransaction = async () => {
    if (!amount || !category) {
      alert("Fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/transactions",
        { amount: Number(amount), category, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAmount("");
      setCategory("");
      setType("expense");

      fetchTransactions();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchTransactions();
    } catch (error) {
      console.log(error);
    }
  };

  const setBudgetHandler = async () => {
    if (!budgetCategory || !budgetLimit) {
      alert("Enter budget details");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/budget",
        {
          category: budgetCategory.toLowerCase(),
          limit: Number(budgetLimit),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBudgetCategory("");
      setBudgetLimit("");

      fetchBudgets();
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Calculations
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const balance = income - expense;

  // ✅ Pie Data
  const categoryData = Object.values(
    transactions.reduce((acc, curr) => {
      if (curr.type === "expense") {
        const key = curr.category.toLowerCase();
        if (!acc[key]) {
          acc[key] = { name: curr.category, value: 0 };
        }
        acc[key].value += Number(curr.amount);
      }
      return acc;
    }, {})
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // ✅ Bar Data
  const barData = [
    { name: "Income", amount: income },
    { name: "Expense", amount: expense },
  ];

  // ✅ Budget Check (FIXED - case insensitive)
  const checkBudget = (category) => {
    const spent = transactions
      .filter(
        (t) =>
          t.category.toLowerCase() === category.toLowerCase() &&
          t.type === "expense"
      )
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const budget = budgets.find(
      (b) => b.category.toLowerCase() === category.toLowerCase()
    );

    return budget && spent > budget.limit;
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>

      {/* Add Transaction */}
      <h3>Add Transaction</h3>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <button onClick={addTransaction}>Add</button>

      <hr />

      {/* Budget */}
      <h3>Set Budget</h3>

      <input
        type="text"
        placeholder="Category"
        value={budgetCategory}
        onChange={(e) => setBudgetCategory(e.target.value)}
      />

      <input
        type="number"
        placeholder="Limit"
        value={budgetLimit}
        onChange={(e) => setBudgetLimit(e.target.value)}
      />

      <button onClick={setBudgetHandler}>Set Budget</button>

      <hr />

      {/* Summary */}
      <h3>Income: ₹{income}</h3>
      <h3>Expense: ₹{expense}</h3>
      <h3>Balance: ₹{balance}</h3>

      {/* Pie Chart */}
      <h3>Spending by Category</h3>

      {categoryData.length === 0 ? (
        <p>No data</p>
      ) : (
        <PieChart width={350} height={300}>
          <Pie data={categoryData} dataKey="value" outerRadius={100}>
            {categoryData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}

      {/* Bar Chart */}
      <h3>Income vs Expense</h3>

      <BarChart width={400} height={300} data={barData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" />
      </BarChart>

      <hr />

      {/* Transactions */}
      {loading ? (
        <p>Loading...</p>
      ) : transactions.length === 0 ? (
        <p>No transactions</p>
      ) : (
        transactions.map((t) => {
          const isLast =
            transactions
              .filter(
                (item) =>
                  item.category.toLowerCase() ===
                    t.category.toLowerCase() &&
                  item.type === "expense"
              )
              .slice(-1)[0]?._id === t._id;

          return (
            <div key={t._id}>
              <span>
                {t.category} - ₹{t.amount} ({t.type})
              </span>

              {isLast && checkBudget(t.category) && (
                <span style={{ color: "red", marginLeft: "10px" }}>
                  ⚠️ Budget exceeded
                </span>
              )}

              <button onClick={() => deleteTransaction(t._id)}>❌</button>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Dashboard;