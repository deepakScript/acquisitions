import logger from "#config/logger.js";
import * as userService from "#services/user.service.js";
import { formatValidationError } from "#utils/format.js";
import { updateUserSchema } from "#validations/user.validation.js";

/**
 * Get all users.
 */
export const getUsers = async (req, res, next) => {
  try {
    const allUsers = await userService.getAllUsers();
    res.status(200).json({
      message: "Fetched all users",
      users: allUsers,
    });
  } catch (error) {
    logger.error("Controller Error in getUsers", { error });
    next(error);
  }
};

/**
 * Get a single user by ID.
 */
export const getUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      message: "Fetched user",
      user,
    });
  } catch (error) {
    logger.error("Controller Error in getUser", { error });
    next(error);
  }
};

/**
 * Update a user.
 */
export const updateUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const validationResult = updateUserSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: formatValidationError(validationResult.error),
      });
    }

    const { name, email, role } = validationResult.data;
    const updatedUser = await userService.updateUser(id, { name, email, role });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    logger.error("Controller Error in updateUser", { error });
    next(error);
  }
};

/**
 * Delete a user.
 */
export const deleteUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const isDeleted = await userService.deleteUser(id);
    if (!isDeleted) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    logger.error("Controller Error in deleteUser", { error });
    next(error);
  }
};
