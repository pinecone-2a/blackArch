import { PrismaClient } from "@prisma/client";

// Create a global singleton for PrismaClient
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// Configure the PrismaClient with error logging
const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({
    log: ['error', 'warn'],
    errorFormat: 'pretty',
  });

// Save the client reference in development to prevent multiple instances
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;


