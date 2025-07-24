const productService = require("../services/productService");

class ProductController {
  async getAllProducts(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        minPrice,
        maxPrice,
        isFeatured,
        search,
      } = req.query;

      const result = await productService.getAllProducts(
        parseInt(page),
        parseInt(limit),
        {
          category,
          minPrice,
          maxPrice,
          isFeatured: isFeatured === "true",
          search,
        }
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductBySlug(req, res, next) {
    try {
      const product = await productService.getProductBySlug(req.params.slug);

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const product = await productService.createProduct(req.body);

      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const product = await productService.updateProduct(
        req.params.id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const result = await productService.deleteProduct(req.params.id);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async addProductRating(req, res, next) {
    try {
      const product = await productService.addProductRating(
        req.params.id,
        req.user._id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: "Rating added successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProductRating(req, res, next) {
    try {
      const product = await productService.updateProductRating(
        req.params.id,
        req.user._id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: "Rating updated successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  async getFeaturedProducts(req, res, next) {
    try {
      const { limit = 8 } = req.query;
      const products = await productService.getFeaturedProducts(
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductsByCategory(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const result = await productService.getProductsByCategory(
        req.params.categoryId,
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async searchProducts(req, res, next) {
    try {
      const { q, page = 1, limit = 10 } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: "Search term is required",
        });
      }

      const result = await productService.searchProducts(
        q,
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
