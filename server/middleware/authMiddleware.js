const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, "secretkey"); // same as login
    req.user = decoded; // ✅ IMPORTANT

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};