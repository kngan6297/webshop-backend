const Product = require("../models/Product");
const Category = require("../models/Category");

class ProductService {
  async getAllProducts(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;

    const query = { isActive: true };

    if (filters.category) query.category = filters.category;
    if (filters.minPrice) query.price = { $gte: filters.minPrice };
    if (filters.maxPrice)
      query.price = { ...query.price, $lte: filters.maxPrice };
    if (filters.isFeatured !== undefined) query.isFeatured = filters.isFeatured;
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    const products = await Product.find(query)
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(productId) {
    const product = await Product.findById(productId)
      .populate("category", "name slug")
      .populate("ratings.user", "name");

    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  async getProductBySlug(slug) {
    const product = await Product.findOne({ slug, isActive: true })
      .populate("category", "name slug")
      .populate("ratings.user", "name");

    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  async createProduct(productData) {
    const product = new Product(productData);
    await product.save();

    return product.populate("category", "name slug");
  }

  async updateProduct(productId, updateData) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    Object.assign(product, updateData);
    await product.save();

    return product.populate("category", "name slug");
  }

  async deleteProduct(productId) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    await Product.findByIdAndDelete(productId);
    return { message: "Product deleted successfully" };
  }

  async addProductRating(productId, userId, ratingData) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const { rating, review } = ratingData;

    // Check if user already rated this product
    const existingRating = product.ratings.find(
      (r) => r.user.toString() === userId
    );
    if (existingRating) {
      throw new Error("You have already rated this product");
    }

    // Add new rating
    product.ratings.push({
      user: userId,
      rating,
      review,
    });

    await product.save();

    return product.populate("ratings.user", "name");
  }

  async updateProductRating(productId, userId, ratingData) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const { rating, review } = ratingData;

    // Find existing rating
    const existingRatingIndex = product.ratings.findIndex(
      (r) => r.user.toString() === userId
    );
    if (existingRatingIndex === -1) {
      throw new Error("No rating found for this product");
    }

    // Update rating
    product.ratings[existingRatingIndex] = {
      user: userId,
      rating,
      review,
      date: new Date(),
    };

    await product.save();

    return product.populate("ratings.user", "name");
  }

  async getFeaturedProducts(limit = 8) {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .populate("category", "name slug")
      .sort({ averageRating: -1 })
      .limit(limit);

    return products;
  }

  async getProductsByCategory(categoryId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const products = await Product.find({
      category: categoryId,
      isActive: true,
    })
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({
      category: categoryId,
      isActive: true,
    });

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async searchProducts(searchTerm, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const products = await Product.find({
      $text: { $search: searchTerm },
      isActive: true,
    })
      .populate("category", "name slug")
      .sort({ score: { $meta: "textScore" } })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({
      $text: { $search: searchTerm },
      isActive: true,
    });

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = new ProductService();
