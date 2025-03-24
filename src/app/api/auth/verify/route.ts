import { verifyToken } from "@/lib/auth/verifyToken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
  
    const decoded = verifyToken(token);
    
    res.status(200).json({ message: "Protected data", user: decoded });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
}
