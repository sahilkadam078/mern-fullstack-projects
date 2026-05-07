import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import requireAuth from "../middleware/auth.js";

const router = express.Router();

const signToken = (user) => jwt.sign(
    { userId: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
);

router.post("/auth/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "name, email and password are required" });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "password must be at least 6 characters" });
    }

    try {
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ error: "email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        const token = signToken(user);
        return res.status(201).json({
            token,
            user: { name: user.name, email: user.email }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to register user" });
    }
});

router.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "email and password are required" });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = signToken(user);
        return res.status(200).json({
            token,
            user: { name: user.name, email: user.email }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to login" });
    }
});

router.get("/auth/me", requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("name email");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to fetch user" });
    }
});

export default router;
