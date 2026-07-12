const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// @POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ message: "This soul already exists in the sewer." });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    res
      .status(201)
      .json({
        message: "Welcome to the sewer. 🎈",
        user: { id: user._id, name: user.name, email: user.email },
      });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Something went wrong in the sewer.",
        error: err.message,
      });
  }
};

// @POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "We don't know you down here." });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Wrong password. IT is watching." });

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    res.json({
      message: "You're back. IT knew you'd return. 🎈",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Something went wrong in the sewer.",
        error: err.message,
      });
  }
};

// @GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    res.json({ user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: err.message });
  }
};

// @POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ message: "You escaped the sewer. For now. 🎈" });
};

module.exports = { register, login, getMe, logout };