const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/userController");
const { authenticate, isAdmin } = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const router = express.Router();

// Validation rules
const updateUserValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

const changeRoleValidation = [
  body("role")
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),
];

// All routes require authentication and admin privileges
router.use(authenticate, isAdmin);

// Routes
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", updateUserValidation, validate, userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.put("/:id/deactivate", userController.deactivateUser);
router.put("/:id/activate", userController.activateUser);
router.put(
  "/:id/role",
  changeRoleValidation,
  validate,
  userController.changeUserRole
);

module.exports = router;
