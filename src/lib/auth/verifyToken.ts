import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  userData: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Verifies a JWT token and returns the decoded payload
 * @param token - The JWT token to verify
 * @param tokenType - The type of token: 'access' or 'refresh'
 * @returns The decoded token payload
 * @throws Error if token is invalid or expired
 */
export const verifyToken = (token: string, tokenType: 'access' | 'refresh' = 'access'): DecodedToken => {
  try {
    const secret = tokenType === 'access' 
      ? process.env.ACCESS_TOKEN_SECRET 
      : process.env.REFRESH_TOKEN_SECRET;
    
    if (!secret) {
      throw new Error(`${tokenType.toUpperCase()}_TOKEN_SECRET is not defined in environment variables`);
    }
 
    const decoded = jwt.verify(token, secret) as DecodedToken;
    
    // Validate required fields in token
    if (!decoded.userData?.id || !decoded.userData?.email || !decoded.userData?.role) {
      throw new Error("Token payload is missing required user data");
    }
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error(`${tokenType} token has expired`);
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error(`Invalid ${tokenType} token`);
    }
    
    // Re-throw the original error or a generic one
    throw error instanceof Error ? error : new Error("Token verification failed");
  }
};

/**
 * Checks if a token is expired without verifying signature
 * @param token - The JWT token to check
 * @returns boolean indicating if token is expired
 */
export const isTokenExpiredWithoutVerification = (token: string): boolean => {
  try {
    const decodedToken = jwt.decode(token) as JwtPayload;
    
    if (!decodedToken?.exp) {
      return true; // No expiration = treat as expired for safety
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= decodedToken.exp;
  } catch (error) {
    return true; // Any decoding error = treat as expired
  }
};