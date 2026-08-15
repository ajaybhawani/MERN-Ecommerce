import User from "../models/User.js";

import bcrypt from "bcryptjs";

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
