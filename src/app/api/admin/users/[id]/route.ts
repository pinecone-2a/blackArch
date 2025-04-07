import { NextResponse } from "next/server";
import prisma from "@/lib/connect";
import bcrypt from "bcrypt";


export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const userId = params.id;
        
   
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { orders: true }
        });
        
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
  
        const formattedUser = {
            id: user.id,
            name: user.username,
            email: user.email,
            role: user.role === "admin" ? "admin" : "user",
            lastActive: user.createdAt,
            status: user.orders.length > 0 ? "active" : "inactive",
            orders: user.orders.length
        };
        
        return NextResponse.json(formattedUser, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}


export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const userId = params.id;
        const body = await request.json();
        const { name, email, role, status, password } = body;
        
    
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });
        
        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
    
        const updateData: any = {};
        
        if (name) updateData.username = name;
        if (email) updateData.email = email;
        if (role) updateData.role = role === "admin" ? "admin" : "customer";
        if (password) updateData.password = await bcrypt.hash(password, 10);
        
      
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            include: { orders: true }
        });
        
    
        return NextResponse.json({
            id: updatedUser.id,
            name: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role === "admin" ? "admin" : "user",
            lastActive: updatedUser.createdAt,
            status: updatedUser.orders.length > 0 ? "active" : "inactive",
            orders: updatedUser.orders.length
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const userId = params.id;
        
  
        
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });
        
        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
   
        await prisma.user.delete({
            where: { id: userId }
        });
        
        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        
 
        if (error instanceof Error && error.message.includes("constraint")) {
            return NextResponse.json({ 
                error: "Cannot delete user with existing orders or data" 
            }, { status: 400 });
        }
        
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
} 