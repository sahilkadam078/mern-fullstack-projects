import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId, email: payload.email };
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};

export default requireAuth;
