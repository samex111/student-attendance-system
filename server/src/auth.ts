import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import type { Request, Response, NextFunction } from 'express';


dotenv.config();

const JWT_FACULTY = process.env.JWT_FACULTY as string;
const JWT_ADMIN = process.env.JWT_ADMIN as string;

declare global {
  namespace Express {
    interface Request {
      adminId?: string;
      userId?: string;
    }
  }
}
export const facultyMiddleware = (req: Request, res: Response, next: NextFunction) => {

  const token = req.cookies.token; 
  console.log("Token: ",token)
  if (!token) return res.status(401).json({ message: "No token provided " });

  try {
    const decoded = jwt.verify(token as string, JWT_FACULTY) as { id: string };
    console.log("Decoded is :" , decoded)
    req.userId = decoded.id;
    console.log("cookies: ", token)
    next();
  }
  catch (e) {
    res.status(400).json({
      error: "your are not signed in "
    })
  }

}
export const AdminMiddleware = (req: Request, res: Response, next: NextFunction) => {

  const token = req.cookies.token; 
  console.log("Token: ",token)
  if (!token) return res.status(401).json({ message: "No token provided " });

  try {
    const decoded = jwt.verify(token as string, JWT_ADMIN) as { id: string };
    console.log("Decoded is :" , decoded)
    req.userId = decoded.id;
    console.log("cookies: ", token)
    next();
  }
  catch (e) {
    res.status(400).json({
      error: "your are not signed in "
    })
  }

}