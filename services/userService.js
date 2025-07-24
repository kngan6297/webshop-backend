const User = require("../models/User");

class UserService {
  async getAllUsers(page = 1, limit = 10, filters = {}) {
    const skip = (page - 1) * limit;

    const query = {};
    if (filters.role) query.role = filters.role;
    if (filters.isActive !== undefined) query.isActive = filters.isActive;
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { email: { $regex: filters.search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateUser(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Remove password from update data to prevent direct password updates
    const { password, ...safeUpdateData } = updateData;

    Object.assign(user, safeUpdateData);
    await user.save();

    return user;
  }

  async deleteUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    await User.findByIdAndDelete(userId);
    return { message: "User deleted successfully" };
  }

  async deactivateUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.isActive = false;
    await user.save();

    return user;
  }

  async activateUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.isActive = true;
    await user.save();

    return user;
  }

  async changeUserRole(userId, newRole) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!["user", "admin"].includes(newRole)) {
      throw new Error("Invalid role");
    }

    user.role = newRole;
    await user.save();

    return user;
  }
}

module.exports = new UserService();
