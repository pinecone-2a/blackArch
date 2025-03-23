import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const getUserFromToken = (req: NextRequest) => {
  const token = req.cookies.get('accessToken')?.value;
  console.log("test", token);

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { userId: string; email: string; role: string};
    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);

    return null;
  }
};