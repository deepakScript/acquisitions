import { register } from "#controllers/auth.controller.js";
import express from "express";

const router = express.Router();

// Example route for user registration
router.post("/register", register);

// Example route for user login
router.post("/login", (req, res) => {
    res.send("User login endpoint");
});


router.post("/logout", (req, res) => {
    res.send("User logout endpoint");
});

export default router;