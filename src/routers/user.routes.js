import express from "express";
import * as userController from "#controllers/user.controller.js";

const router = express.Router();

// GET all users
router.get("/", userController.getUsers);

// GET a single user by ID
router.get("/:id", userController.getUser);

// UPDATE a user by ID
router.put("/:id", userController.updateUser);

// DELETE a user by ID
router.delete("/:id", userController.deleteUser);

export default router;
