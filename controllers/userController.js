const userService = require("../services/userService");

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, role, isActive, search } = req.query;

      const result = await userService.getAllUsers(
        parseInt(page),
        parseInt(limit),
        { role, isActive: isActive === "true", search }
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const result = await userService.deleteUser(req.params.id);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async deactivateUser(req, res, next) {
    try {
      const user = await userService.deactivateUser(req.params.id);

      res.status(200).json({
        success: true,
        message: "User deactivated successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async activateUser(req, res, next) {
    try {
      const user = await userService.activateUser(req.params.id);

      res.status(200).json({
        success: true,
        message: "User activated successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async changeUserRole(req, res, next) {
    try {
      const { role } = req.body;
      const user = await userService.changeUserRole(req.params.id, role);

      res.status(200).json({
        success: true,
        message: "User role updated successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
