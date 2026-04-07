import { z } from "zod";

/**
 * Schema for updating user details.
 */
export const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(255, "Email must be less than 255 characters")
    .email("Invalid email address")
    .optional(),
  role: z.enum(["admin", "user"], "Role must be either admin or user").optional(),
});
