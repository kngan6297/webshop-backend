// seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const sampleDescriptions = [
  "Premium quality product designed for exceptional performance and durability. Perfect for daily use and long-term reliability.",
  "Customer favorite with thousands of positive reviews. This best-selling item offers unbeatable value and quality.",
  "Limited stock available! Don't miss out on this exclusive product that combines style, functionality, and affordability.",
  "Engineered for superior performance and comfort. Ideal for both professional and personal use with outstanding results.",
  "Crafted with attention to detail and modern design principles. Offers the perfect blend of style, comfort, and functionality.",
  "High-quality materials ensure lasting durability while maintaining excellent performance standards. A smart investment for your needs.",
  "Innovative design meets practical functionality. This product delivers exceptional results with every use.",
  "Professional-grade quality at an affordable price. Trusted by experts and loved by customers worldwide.",
  "State-of-the-art technology combined with user-friendly design. Experience the difference that quality makes.",
  "Built to last with premium materials and expert craftsmanship. Your satisfaction is our top priority.",
];

const unsplashKeywords = [
  "electronics",
  "clothing",
  "kitchen",
  "books",
  "beauty",
];

// More specific keywords for better product images
const productImageKeywords = {
  Electronics: ["smartphone", "laptop", "headphones", "camera", "gaming"],
  Clothing: ["fashion", "shirt", "dress", "shoes", "accessories"],
  "Home & Kitchen": [
    "kitchen",
    "home-decor",
    "furniture",
    "appliances",
    "cookware",
  ],
  Books: ["books", "library", "reading", "study", "education"],
  Beauty: ["cosmetics", "skincare", "makeup", "perfume", "beauty-products"],
};

const generateUnsplashImage = (keyword, size = "600x600") => {
  const timestamp = Date.now();
  const randomId = Math.floor(Math.random() * 1000);
  // Use a more reliable Unsplash URL format
  return `https://source.unsplash.com/${size}?${keyword}&${timestamp}-${randomId}`;
};

// Fallback images in case Unsplash is down
const fallbackImages = {
  Electronics: [
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
  ],
  Clothing: [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop",
  ],
  "Home & Kitchen": [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop",
  ],
  Books: [
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop",
  ],
  Beauty: [
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop",
  ],
};

const generateProductImages = (categoryName, count = 3) => {
  const keywords = productImageKeywords[categoryName] || [
    categoryName.toLowerCase(),
  ];
  const images = [];
  const fallbackCategoryImages =
    fallbackImages[categoryName] || fallbackImages["Electronics"];

  for (let i = 0; i < count; i++) {
    try {
      const randomKeyword =
        keywords[Math.floor(Math.random() * keywords.length)];
      // Use fallback images for now to ensure reliability
      const imageIndex = i % fallbackCategoryImages.length;
      images.push(fallbackCategoryImages[imageIndex]);
    } catch (error) {
      // If Unsplash fails, use fallback
      const imageIndex = i % fallbackCategoryImages.length;
      images.push(fallbackCategoryImages[imageIndex]);
    }
  }

  return images;
};

const categoriesData = [
  { name: "Electronics", description: "Gadgets and devices" },
  { name: "Clothing", description: "Fashionable apparel" },
  { name: "Home & Kitchen", description: "Essentials for your home" },
  { name: "Books", description: "Explore the world of knowledge" },
  { name: "Beauty", description: "Skincare and cosmetics" },
];

const usersData = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    password: "password123",
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    password: "password123",
  },
  {
    name: "Charlie Lee",
    email: "charlie@example.com",
    password: "password123",
  },
  {
    name: "Diana Chen",
    email: "diana@example.com",
    password: "password123",
  },
  {
    name: "Ethan Brown",
    email: "ethan@example.com",
    password: "password123",
  },
];

const createProducts = async (categoryDoc, keyword) => {
  const products = [];

  // Product names for each category
  const productNames = {
    Electronics: [
      "Wireless Bluetooth Headphones",
      'Smart LED TV 55"',
      "Gaming Laptop Pro",
      "4K Action Camera",
      "Smartphone Galaxy S23",
      "Wireless Charging Pad",
      "Bluetooth Speaker",
      "Gaming Mouse RGB",
      "Mechanical Keyboard",
      "Smart Watch Series 8",
    ],
    Clothing: [
      "Premium Cotton T-Shirt",
      "Denim Jacket Classic",
      "Running Shoes Pro",
      "Summer Dress Floral",
      "Leather Handbag",
      "Sunglasses Aviator",
      "Winter Coat Warm",
      "Casual Sneakers",
      "Formal Shirt Business",
      "Jeans Slim Fit",
    ],
    "Home & Kitchen": [
      "Coffee Maker Premium",
      "Kitchen Mixer Pro",
      "Blender Smoothie",
      "Toaster 4-Slice",
      "Microwave Oven",
      "Dishwasher Compact",
      "Refrigerator Smart",
      "Oven Electric",
      "Coffee Grinder",
      "Food Processor",
    ],
    Books: [
      "The Art of Programming",
      "Business Strategy Guide",
      "Science Fiction Novel",
      "Cooking Recipe Book",
      "Self-Help Motivation",
      "History Encyclopedia",
      "Travel Adventure",
      "Poetry Collection",
      "Children's Storybook",
      "Academic Textbook",
    ],
    Beauty: [
      "Anti-Aging Cream",
      "Hair Dryer Professional",
      "Makeup Brush Set",
      "Perfume Luxury",
      "Face Mask Hydrating",
      "Nail Polish Set",
      "Hair Straightener",
      "Eye Shadow Palette",
      "Lipstick Matte",
      "Skincare Serum",
    ],
  };

  const names =
    productNames[categoryDoc.name] ||
    Array.from(
      { length: 10 },
      (_, i) => `${categoryDoc.name} Product ${i + 1}`
    );

  for (let i = 0; i < 10; i++) {
    const name = names[i];
    const price = getRandomInt(15, 500);
    const comparePrice = price + getRandomInt(10, 100);
    const stock = getRandomInt(5, 200);

    // Generate slug manually since insertMany doesn't trigger pre-save hooks
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    products.push({
      name,
      description:
        sampleDescriptions[getRandomInt(0, sampleDescriptions.length - 1)],
      price,
      comparePrice,
      category: categoryDoc._id,
      images: generateProductImages(categoryDoc.name, getRandomInt(2, 4)), // Multiple images
      stock,
      sku: `${categoryDoc.name.slice(0, 3).toUpperCase()}-${(i + 1)
        .toString()
        .padStart(4, "0")}`,
      slug: `${slug}-${i + 1}`, // Add unique suffix to avoid conflicts
      isFeatured: i % 3 === 0,
      weight: parseFloat((Math.random() * 5).toFixed(2)),
      dimensions: {
        length: getRandomInt(10, 50),
        width: getRandomInt(5, 30),
        height: getRandomInt(2, 20),
      },
      tags: [categoryDoc.name.toLowerCase(), "featured", "new"],
    });
  }

  await Product.insertMany(products);
  console.log(`🛒 Inserted 10 products for category: ${categoryDoc.name}`);
};

const seedDatabase = async () => {
  try {
    // Use environment variable for MongoDB connection
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Clear previous data
    console.log("🧹 Clearing existing data...");
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();

    // Seed users
    for (const user of usersData) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      await User.create({ ...user, password: hashedPassword });
    }
    console.log("👥 Created users and admin.");

    // Seed categories and products
    for (let i = 0; i < categoriesData.length; i++) {
      const catData = categoriesData[i];
      const keyword = unsplashKeywords[i];

      // Use reliable category images
      const categoryImages = {
        Electronics:
          "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop",
        Clothing:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
        "Home & Kitchen":
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
        Books:
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop",
        Beauty:
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop",
      };

      const cat = new Category({
        ...catData,
        image:
          categoryImages[catData.name] ||
          generateUnsplashImage(keyword, "800x600"),
      });
      await cat.save();
      await createProducts(cat, keyword);
    }

    console.log("🎉 Seeding completed successfully.");
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedDatabase();
