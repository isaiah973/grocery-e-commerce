const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

const connectDB = require("./config/db");
const userRoutes = require("./Routes/userRoutes");
const productRoutes = require("./Routes/productRoutes");

const app = express();

connectDB();

app.use(cors({
  origin: ["http://localhost:5173", "https://your-frontend.vercel.app"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);



app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
