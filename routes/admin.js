const express = require("express");
const adminController = require("../controllers/adminController");
const auth = require("../middlewares/auth");

const router = express.Router();

// All admin routes require authentication and admin role
router.use(auth.authenticate);
router.use(auth.authorize("admin"));

// Dashboard stats
router.get("/stats", adminController.getDashboardStats);

// Recent data
router.get("/recent-products", adminController.getRecentProducts);
router.get("/recent-users", adminController.getRecentUsers);

// Management endpoints
router.get("/users", adminController.getAllUsers);
router.get("/products", adminController.getAllProducts);
router.post("/products", adminController.createProduct);
router.get("/products/:id", adminController.getProduct);
router.put("/products/:id", adminController.updateProduct);
router.delete("/products/:id", adminController.deleteProduct);

module.exports = router;
