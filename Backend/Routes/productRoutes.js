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
const { protect, adminOnly } = require("../Middleware/authMiddleware");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// routes
router.get("/get-products", getAllProducts);
router.get("/product/:id", getSingleProduct);

router.post(
  "/create-product",
  protect,
  adminOnly,
  upload.single("image"),
  createProduct
);
router.put("/update-product/:id", upload.single("image"), updateProduct);
router.delete("/delete-product/:id", deleteProduct);
router.patch("/toggle-product/:id", toggleProductStatus);

module.exports = router;