import db from "#config/database.js";
import { users } from "#models/user.model.js";
import { eq } from "drizzle-orm";
import logger from "#config/logger.js";

/**
 * Get all users from the database, excluding passwords.
 * @returns {Promise<Array>} List of user objects.
 */
export const getAllUsers = async () => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users);
    logger.info("Fetched all users successfully", { count: allUsers.length });
    return allUsers;
  } catch (error) {
    logger.error("Error fetching all users", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    throw new Error("Error fetching users", { cause: error });
  }
};

/**
 * Get a single user by their ID, excluding the password.
 * @param {number} id - The user's ID.
 * @returns {Promise<Object|null>} User object or null if not found.
 */
export const getUserById = async (id) => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (user) {
      logger.info("User found by ID", { userId: id });
    } else {
      logger.warn("User not found by ID", { userId: id });
    }
    return user || null;
  } catch (error) {
    logger.error("Error fetching user by ID", {
      userId: id,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    throw new Error("Error fetching user", { cause: error });
  }
};

/**
 * Update a user's details.
 * @param {number} id - The user's ID.
 * @param {Object} data - The update data (name, email, role).
 * @returns {Promise<Object|null>} The updated user or null if not found.
 */
export const updateUser = async (id, data) => {
  try {
    // Normalize email if present
    if (data.email) {
      data.email = data.email.trim().toLowerCase();
    }

    const [updatedUser] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    if (updatedUser) {
      logger.info("User updated successfully", { userId: id });
    } else {
      logger.warn("User not found for update", { userId: id });
    }
    return updatedUser || null;
  } catch (error) {
    logger.error("Error updating user", {
      userId: id,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    throw new Error("Error updating user", { cause: error });
  }
};

/**
 * Delete a user from the database.
 * @param {number} id - The user's ID.
 * @returns {Promise<boolean>} True if deleted, false otherwise.
 */
export const deleteUser = async (id) => {
  try {
    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });

    if (deletedUser) {
      logger.info("User deleted successfully", { userId: id });
      return true;
    }
    logger.warn("User not found for deletion", { userId: id });
    return false;
  } catch (error) {
    logger.error("Error deleting user", {
      userId: id,
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    throw new Error("Error deleting user", { cause: error });
  }
};
