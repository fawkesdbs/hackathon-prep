import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, phone_number, name, surname } = req.body;

    // Basic validation
    if (!email || !password || !phone_number || !name || !surname) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await authService.registerUser(
      email,
      password,
      phone_number,
      name,
      surname
    );

    return res
      .status(201)
      .json({ message: "User registered successfully", user });
  } catch (err: any) {
    // The Supabase client throws an error with a specific message for existing users.
    if (err.message && err.message.includes("User already registered")) {
      return res
        .status(409)
        .json({ error: "A user with this email already exists." });
    }

    console.error("Register controller error:", err);
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { token, user } = await authService.loginUser(email, password);

    return res.status(200).json({ token, user });
  } catch (err: any) {
    console.error("Login controller error:", err);
    // Return a generic error to avoid revealing whether an email exists.
    return res.status(401).json({ error: "Invalid email or password" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    // Assumes a middleware has verified the JWT and attached the user's ID to the request.
    const userId = (req as any).user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized. No user ID found in token." });
    }

    const user = await authService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("GetMe controller error:", err);
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
};
