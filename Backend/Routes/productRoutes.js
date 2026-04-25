const express = require("express");
const multer = require("multer");

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} = require("../controllers/productController");

const { protect, adminOnly, protectOptional } = require("../Middleware/authMiddleware");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ PUBLIC ROUTES
router.get("/get-products", getAllProducts);
router.get("/product/:id", protectOptional, getSingleProduct);

// 🔐 ADMIN ROUTES
router.post(
  "/create-product",
  protect,
  adminOnly,
  upload.single("image"),
  createProduct
);

router.put(
  "/update-product/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateProduct
);

router.delete(
  "/delete-product/:id",
  protect,
  adminOnly,
  deleteProduct
);

router.patch(
  "/toggle-product/:id",
  protect,
  adminOnly,
  toggleProductStatus
);

module.exports = router;