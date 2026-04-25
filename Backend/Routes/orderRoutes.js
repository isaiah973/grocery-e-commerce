const express = require("express");
const {
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../Middleware/authMiddleware");

const router = express.Router();

// Admin routes
router.get("/", protect, adminOnly, getAllOrders);
router.get("/:id", protect, adminOnly, getSingleOrder);
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;