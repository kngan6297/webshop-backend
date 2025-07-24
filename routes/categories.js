const express = require("express");
const { body } = require("express-validator");
const categoryController = require("../controllers/categoryController");
const { authenticate, isAdmin } = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const router = express.Router();

// Validation rules
const createCategoryValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description cannot exceed 200 characters"),
  body("image")
    .optional()
    .trim()
    .isURL()
    .withMessage("Image must be a valid URL"),
];

const updateCategoryValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description cannot exceed 200 characters"),
  body("image")
    .optional()
    .trim()
    .isURL()
    .withMessage("Image must be a valid URL"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

// Public routes (no authentication required)
router.get("/", categoryController.getAllCategories);
router.get("/with-count", categoryController.getCategoriesWithProductCount);
router.get("/slug/:slug", categoryController.getCategoryBySlug);
router.get("/:id", categoryController.getCategoryById);

// Admin routes (admin authentication required)
router.post(
  "/",
  authenticate,
  isAdmin,
  createCategoryValidation,
  validate,
  categoryController.createCategory
);
router.put(
  "/:id",
  authenticate,
  isAdmin,
  updateCategoryValidation,
  validate,
  categoryController.updateCategory
);
router.delete("/:id", authenticate, isAdmin, categoryController.deleteCategory);

module.exports = router;
