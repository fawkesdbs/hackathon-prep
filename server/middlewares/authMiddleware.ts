// middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { supabase } from "../config/db";
import { User } from "@supabase/supabase-js"; // Import the specific User type

// This block consistently defines the 'user' property on the Request object.
// This should be the single source of truth for this type definition.
declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Use Supabase's built-in method to verify the token
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error) {
      console.error("Supabase auth error:", error.message);
      return res
        .status(401)
        .json({ message: error.message || "Invalid token" });
    }

    if (!user) {
      return res.status(401).json({ message: "User not found for this token" });
    }

    // Attach the authenticated user object to the request
    req.user = user;

    next();
  } catch (error: any) {
    console.error("Auth middleware catch block error:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default authMiddleware;
