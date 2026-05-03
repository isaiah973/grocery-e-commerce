const mongoose = require("mongoose");
const Order = require("../Models/orderModel");

// ADMIN: Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "title image price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("getAllOrders error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

// ADMIN: Get single order
const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("orderItems.product", "title image price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("getSingleOrder error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

// ADMIN: Update order status / payment status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const allowedOrderStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    const allowedPaymentStatuses = [
      "pending",
      "paid",
      "failed",
      "abandoned",
      "refunded",
    ];

    if (orderStatus !== undefined) {
      if (!allowedOrderStatuses.includes(orderStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid orderStatus. Allowed values: ${allowedOrderStatuses.join(", ")}`,
        });
      }

      order.orderStatus = orderStatus;

      if (orderStatus === "delivered" && !order.deliveredAt) {
        order.deliveredAt = new Date();
      }
    }

    if (paymentStatus !== undefined) {
      if (!allowedPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid paymentStatus. Allowed values: ${allowedPaymentStatuses.join(", ")}`,
        });
      }

      order.paymentStatus = paymentStatus;

      if (paymentStatus === "paid" && !order.paidAt) {
        order.paidAt = new Date();
      }
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("updateOrderStatus error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update order",
    });
  }
};

//=============================USER CONTROLLERS BELOW=============================

// USER: Get my orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product", "title image price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("getMyOrders error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your orders",
    });
  }
};

// USER: Get single order (must belong to user)
const getMySingleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id).populate(
      "orderItems.product",
      "title image price",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🔐 IMPORTANT: user can only access their own order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("getMySingleOrder error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

// USER: Cancel order
const cancelMyOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🔐 Ownership check
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order",
      });
    }

    // ❌ Cannot cancel after processing
    if (order.orderStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    order.orderStatus = "cancelled";

    // optional: mark payment abandoned if still pending
    if (order.paymentStatus === "pending") {
      order.paymentStatus = "abandoned";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("cancelMyOrder error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,

  // USER CONTROLLERS

  getMyOrders,
  getMySingleOrder,
  cancelMyOrder,
};
