import { NextResponse } from "next/server";
import prisma from "@/lib/connect";

// Define interfaces for the diagnostics data structure
interface TableInfo {
  name: string;
  count: number;
}

interface DatabaseInfo {
  connection: string;
  error: string | null;
  url: string;
  tables: TableInfo[];
}

interface DiagnosticsData {
  timestamp: string;
  environment: string | undefined;
  database: DatabaseInfo;
  prisma: {
    version: string;
  };
}

export async function GET() {
  console.log("Debug API route called");
  
  const diagnostics: DiagnosticsData = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: {
      connection: "unknown",
      error: null,
      url: "Checking...",
      tables: []
    },
    prisma: {
      // Cast to any to avoid TypeScript errors with internal Prisma properties
      version: (prisma as any)._engineConfig?.engineVersion || "unknown"
    }
  };
  
  try {
    console.log("Testing database connection...");
    
    // Test connection
    await prisma.$connect();
    diagnostics.database.connection = "connected";
    
    // Check for database URL (sanitized)
    const dbUrl = process.env.DATABASE_URL || "Not configured";
    diagnostics.database.url = dbUrl.replace(/\/\/.*@/, "//***:***@");
    
    // Try to get table information
    try {
      const users = await prisma.user.count();
      diagnostics.database.tables.push({
        name: "users",
        count: users
      });
    } catch (e) {
      console.error("Error counting users:", e);
    }
    
    try {
      const orders = await prisma.order.count();
      diagnostics.database.tables.push({
        name: "orders",
        count: orders
      });
    } catch (e) {
      console.error("Error counting orders:", e);
    }
    
    try {
      const products = await prisma.product.count();
      diagnostics.database.tables.push({
        name: "products",
        count: products
      });
    } catch (e) {
      console.error("Error counting products:", e);
    }
    
    console.log("Diagnostics collected successfully");
    return NextResponse.json(diagnostics, { status: 200 });
  } catch (error) {
    console.error("Database connection error:", error);
    diagnostics.database.connection = "error";
    diagnostics.database.error = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json(diagnostics, { status: 500 });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (e) {
      console.error("Error disconnecting from database:", e);
    }
  }
} 