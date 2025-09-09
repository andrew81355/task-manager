import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const router = Router();

const { JWT_ACCESS_SECRET } = process.env;
const { JWT_REFRESH_SECRET } = process.env;

function signAccessToken(user) {
  return jwt.sign({ sub: user.id, email: user.email}, JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
}
function signRefreshToken(user) {
  return jwt.sign(
    { sub: user.id, v: user.refreshVersion ?? 0 },
    JWT_REFRESH_SECRET,
    { expiresIn: "14d" }
  );
}

export function authenticate(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) {
    return res.status(401).json({ message: "No token" });
  }
  try {
    req.user = jwt.verify(token, JWT_ACCESS_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid/expired token" });
  }
}

// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body ?? {};
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email, password are required" });
    }

    const exists = await User.findOne({ email }).lean();
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role ?? "user",
      refreshVersion: 0,
    });

    res.status(201).json(user.toJSON());
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    // select('+password') if your schema has select:false on password
    const user = await User.findOne({ email }).select(
      "+password +refreshVersion"
    );
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // comparePassword comes from your schema method
    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    // HttpOnly refresh cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // set true in production (HTTPS)
      secure: false,
      sameSite: "strict",
      path: "/auth/refresh",
      maxAge: 14 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// POST /auth/refresh
router.post("/refresh", async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Missing refresh token" });
    }

    const payload = jwt.verify(token, JWT_REFRESH_SECRET); 
    const user = await User.findById(payload.sub).select("+refreshVersion");
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh" });
    }

    // verify server-side version
    if ((user.refreshVersion ?? 0) !== payload.v) {
      return res.status(401).json({ message: "Refresh revoked" });
    }

    const accessToken = signAccessToken(user);
    res.json({ accessToken });
  } catch {
    res.status(401).json({ message: "Invalid/expired refresh" });
  }
});

// POST /auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", { path: "/auth/refresh" });
  res.json({ message: "Logged out" });
});

// GET /auth/me (example protected route inside the module)
router.get("/me", authenticate, async(req, res) => {
  try {
    const me = await User.findById(req.user.sub);
    if (!me) { 
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(me.toJSON());
  } catch (err) {
    res.status(500).json({ message: 'Failed to load profile', error: err.message });
  }
});

export default router;
