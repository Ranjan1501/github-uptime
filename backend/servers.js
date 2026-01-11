require("dotenv").config();
const express = require("express");
const cors = require("cors");

const githubRoutes = require("./routes/users.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/github", githubRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
