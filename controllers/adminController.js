const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");

class AdminController {
  // Get dashboard stats
  async getDashboardStats(req, res, next) {
    try {
      const totalUsers = await User.countDocuments();
      const totalProducts = await Product.countDocuments();
      const totalCategories = await Category.countDocuments();

      // Calculate total revenue (mock for now since we don't have orders)
      const totalRevenue = 0; // This would come from orders in a real app
      const totalOrders = 0; // This would come from orders in a real app

      res.status(200).json({
        success: true,
        data: {
          totalUsers,
          totalProducts,
          totalCategories,
          totalRevenue,
          totalOrders,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get recent products
  async getRecentProducts(req, res, next) {
    try {
      const products = await Product.find()
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name price stock category images");

      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get recent users
  async getRecentUsers(req, res, next) {
    try {
      const users = await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email role createdAt");

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all users for admin management
  async getAllUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const users = await User.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-password");

      const total = await User.countDocuments();

      res.status(200).json({
        success: true,
        data: {
          users,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all products for admin management
  async getAllProducts(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const products = await Product.find()
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Product.countDocuments();

      res.status(200).json({
        success: true,
        data: {
          products,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new product
  async createProduct(req, res, next) {
    try {
      const productData = req.body;

      console.log("Creating product with data:", productData);

      // Validate category exists
      const category = await Category.findById(productData.category);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      // Generate a simple slug from name
      const slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const product = new Product({
        ...productData,
        slug,
      });

      console.log("Product model instance:", product);
      console.log("Generated slug:", slug);

      await product.save();

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      console.error("Error creating product:", error);

      // Handle duplicate key errors more specifically
      if (error.code === 11000) {
        console.error("Full error object:", error);
        console.error("Key pattern:", error.keyPattern);
        console.error("Key value:", error.keyValue);

        const field = Object.keys(error.keyPattern)[0];
        console.error(`Duplicate key error on field: ${field}`);
        console.error(`Duplicate value: ${error.keyValue[field]}`);

        return res.status(400).json({
          success: false,
          message: `A product with this ${field} already exists`,
          field: field,
          value: error.keyValue[field],
          errorDetails: {
            keyPattern: error.keyPattern,
            keyValue: error.keyValue,
          },
        });
      }

      next(error);
    }
  }

  // Get single product
  async getProduct(req, res, next) {
    try {
      const product = await Product.findById(req.params.id).populate(
        "category",
        "name"
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update product
  async updateProduct(req, res, next) {
    try {
      const productData = req.body;

      // Create slug from name if name is being updated
      if (productData.name) {
        productData.slug = productData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        productData,
        { new: true, runValidators: true }
      ).populate("category", "name");

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete product
  async deleteProduct(req, res, next) {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
