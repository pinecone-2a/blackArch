import prisma from "@/lib/connect";
import { NextResponse } from "next/server";

import bcrypt from "bcrypt"; 

export const POST = async (req: Request) => {
    const body = await req.json();
    const {username, email, password} = body


  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if(existingUser) {
        return NextResponse.json({ error: "Бүртгэлтэй Email байна."})
    }
 
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            username,
            phoneNumber:  95565349

        }
    })

    return NextResponse.json({ message: "Хэрэглэгч амжилттай бүртгэгдлээ", user, status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
};

