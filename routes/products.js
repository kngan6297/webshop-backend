const express = require("express");
const { body } = require("express-validator");
const productController = require("../controllers/productController");
const { authenticate, isAdmin, isUser } = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const router = express.Router();

// Validation rules
const createProductValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category").isMongoId().withMessage("Valid category ID is required"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("sku")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("SKU cannot be empty if provided"),
  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be a boolean"),
  body("weight")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Weight must be a positive number"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
];

const updateProductValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product description cannot be empty"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category")
    .optional()
    .isMongoId()
    .withMessage("Valid category ID is required"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be a boolean"),
  body("weight")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Weight must be a positive number"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
];

const ratingValidation = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("review")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Review cannot exceed 500 characters"),
];

// Public routes (no authentication required)
router.get("/", productController.getAllProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/search", productController.searchProducts);
router.get("/category/:categoryId", productController.getProductsByCategory);
router.get("/slug/:slug", productController.getProductBySlug);
router.get("/:id", productController.getProductById);

// Protected routes (authentication required)
router.post(
  "/:id/ratings",
  authenticate,
  isUser,
  ratingValidation,
  validate,
  productController.addProductRating
);
router.put(
  "/:id/ratings",
  authenticate,
  isUser,
  ratingValidation,
  validate,
  productController.updateProductRating
);

// Admin routes (admin authentication required)
router.post(
  "/",
  authenticate,
  isAdmin,
  createProductValidation,
  validate,
  productController.createProduct
);
router.put(
  "/:id",
  authenticate,
  isAdmin,
  updateProductValidation,
  validate,
  productController.updateProduct
);
router.delete("/:id", authenticate, isAdmin, productController.deleteProduct);

module.exports = router;
