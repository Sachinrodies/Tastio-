import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"; 

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;

    if (!decoded) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    req.userId = decoded.userId; // or decoded.id, depending on what you store
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
