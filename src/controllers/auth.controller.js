import logger from "#config/logger.js";
import { createUser, existUserByEmail } from "#services/auth.service.js";
import { formatValidationError } from "#utils/format.js";
import { loginSchema, registerSchema } from "#validations/auth.validation.js";
import { jwttoken } from "./../utils/jwt.js";
import { cookies } from "./../utils/cookies.js";
export const register = async (req, res, next) => {
  try {
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "validation failed",
        details: formatValidationError(validationResult.error),
      });
    }

    const { name, email, password, role } = validationResult.data;
    // auth service
    const existUserByEmailResult = await existUserByEmail(email);
    if (existUserByEmailResult) {
      logger.error("User with this email already exists", { email });
      return res.status(409).json({ message: "User with this email already exists" });
    }
    const user = await createUser({ name, email, password, role });

    const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role }, "1h");

    cookies.set(res, "token", token);

    logger.info("User registered successfully", { email: user.email });
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    logger.error("Signup error", { error });
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "validation failed",
        details: formatValidationError(validationResult.error),
      });
    }
    // Implement login logic here (e.g., check user credentials, generate JWT, etc.)
    const { email } = validationResult.data;

    logger.info("User logged in successfully", { email });
    res.json({ message: "User login successful" });
  } catch (error) {
    logger.error("Login error", { error });
    next(error);
  }
};
