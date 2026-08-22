import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//sign up user
export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // check for user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);
    // create user
    await User.create({
      name,
      email,
      password: hashPassword,
    });
    res.status(201).json({ message: "User register successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error:", error });
  }
};

//login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check for user already exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    //compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // genrate jwt token

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      // expiresIn: "1d",
      expiresIn: "30m",
    });
    res.json({
      message: "Login successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error:", error });
  }
};
