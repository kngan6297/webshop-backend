const User = require("../models/User");
const { generateToken } = require("../config/jwt");

class AuthService {
  async register(userData) {
    const { email, password, name, role = "user" } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    return {
      user,
      token,
    };
  }

  async login(email, password) {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    return {
      user,
      token,
    };
  }

  async getProfile(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Remove sensitive fields from update data
    const { password, role, email, ...safeUpdateData } = updateData;

    Object.assign(user, safeUpdateData);
    await user.save();

    return user;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return { message: "Password updated successfully" };
  }
}

module.exports = new AuthService();
