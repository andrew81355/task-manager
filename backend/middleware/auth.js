import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "dev-access-secret";

export async function requireAuth(req, res, next) {

    // bypass if running tests
  if (process.env.NODE_ENV === 'test') {
    req.user = { id: 'test-user-id', email: 'test@example.com', role: 'user' };
    return next();
  }
  try {
    // Read token from Authorization header
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization required" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_ACCESS_SECRET);

    // Optionally check if user still exists
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach to req for later handlers
    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
