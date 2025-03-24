import prisma from "@/lib/connect";
import { NextResponse } from "next/server";
import {cookies} from 'next/headers'
import jwt from "jsonwebtoken";


export const POST = async (req: Request) => {
    const body = await req.json();
    const { email, password} = body


  try {
    const cookieStore = await cookies()
    const bcrypt = require("bcrypt")
    const user = await prisma.user.findUnique({ where: { email } });
    if(!user) {
        return NextResponse.json({ error: "Та нууц үг болон имайлээ дахин шалгана уу!."})
    }
    if(user?.password) {
        const isMatch = bcrypt.compareSync(password, user.password)
        if(!isMatch) {
          return NextResponse.json({ error: "Та нууц үг болон имайлээ дахин шалгана уу!."})
        } else {
            const userData = await prisma.user.findFirst({
                where: {email: email },
                select: {id: true, email: true, role: true}
            });
            const refreshToken = jwt.sign(
                {userData},
                process.env.REFRESH_TOKEN_SECRET!,
                { expiresIn: "7d" }

            );
            const accessToken = jwt.sign(
                {userData},
                process.env.ACCESS_TOKEN_SECRET!,
                {expiresIn: "1h"}
            );

            cookieStore.set('refreshToken', refreshToken), {
                httpOnly: true,
                sameSite: 'Strict'
            } 

            cookieStore.set('accessToken', accessToken), {
                httpOnly: true,
                sameSite: 'Strict'
            } 


            return NextResponse.json({
                message: "Хэрэглэгч амжилттай нэвтэрлээ.",
                user: {
                  id: user.id,
                  email: user.email
                },
                status: 200,
              });
        }
    }


    return NextResponse.json({ error: "Нууц үг буруу байна." });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
};

