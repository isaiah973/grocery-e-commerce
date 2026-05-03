const express = require("express");
const {
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  getMyOrders,
  getMySingleOrder,
  cancelMyOrder,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../Middleware/authMiddleware");

const router = express.Router();

// Admin routes
router.get("/", protect, adminOnly, getAllOrders);
router.get("/:id", protect, adminOnly, getSingleOrder);
router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

// User routes
router.get("/myorders", protect, getMyOrders);
router.get("/myorders/:id", protect, getMySingleOrder);
router.patch("/myorders/:id/cancel", protect, cancelMyOrder);

module.exports = router;
