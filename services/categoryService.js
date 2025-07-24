const Category = require('../models/Category');
const Product = require('../models/Product');

class CategoryService {
  async getAllCategories() {
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 });
    return categories;
  }

  async getCategoryById(categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async getCategoryBySlug(slug) {
    const category = await Category.findOne({ slug, isActive: true });
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async createCategory(categoryData) {
    const category = new Category(categoryData);
    await category.save();
    return category;
  }

  async updateCategory(categoryId, updateData) {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    Object.assign(category, updateData);
    await category.save();
    return category;
  }

  async deleteCategory(categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: categoryId });
    if (productCount > 0) {
      throw new Error('Cannot delete category with existing products');
    }

    await Category.findByIdAndDelete(categoryId);
    return { message: 'Category deleted successfully' };
  }

  async getCategoriesWithProductCount() {
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 });

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({ 
          category: category._id, 
          isActive: true 
        });
        return {
          ...category.toObject(),
          productCount
        };
      })
    );

    return categoriesWithCount;
  }
}

module.exports = new CategoryService(); 