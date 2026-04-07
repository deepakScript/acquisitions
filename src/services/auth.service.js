import logger from "#config/logger.js";
import bcrypt from "bcrypt";
import db from "#config/database.js";
import { users } from "#models/user.model.js";
import { eq } from "drizzle-orm";
export const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error("Error hashing password", { error });
    throw new Error("Error hashing password", { cause: error });
  }
};

export const createUser = async ({ name, email, password, role = "user" }) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const password_hash = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email: normalizedEmail,
        password: password_hash,
        role,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      });
    logger.info("User created successfully", { email: normalizedEmail });
    return newUser;
  } catch (error) {
    logger.error("Error creating user", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    throw new Error("Error creating user", { cause: error });
  }
};

export const existUserByEmail = async (email) => {
  try {
    if (!email) return false;
    const normalizedEmail = email.trim().toLowerCase();
    const result = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
    const exists = result.length > 0;
    logger.info("User existence checked", { email: normalizedEmail, exists });
    return exists;
  } catch (error) {
    logger.error("Error checking user existence by email", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    throw new Error("Error checking user existence by email", { cause: error });
  }
};
