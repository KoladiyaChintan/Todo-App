import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/userModel";
import services from "../helper";
import jwt from "jsonwebtoken";

interface User {
  _id: string;
  username: string;
  password: string;
}

const register = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log("Enter in logIn :>> ", req.body);
    if (services.validateResult(req, res)) {
      return;
    }
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", userId: newUser });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

const login = async (req: Request, res: Response): Promise<any> => {
  try {
    if (services.validateResult(req, res)) {
      return;
    }
    const { username, password } = req.body;

    const user = (await User.findOne({ username })) as User;
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("isPasswordValid", isPasswordValid);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};
export { register, login };
