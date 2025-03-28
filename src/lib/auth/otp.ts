import nodemailer from "nodemailer";
import prisma from "@/lib/connect";


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: "pineshop.blackarch@gmail.com",
    pass: "",
  },
});

export const sendOtp = async (email: string) => {
  const otp = Math.floor(100000 + Math.random() * 900000);

  const info = await transporter.sendMail({
    from: "<ironmind012@gmail.com>", // sender address
    to: email, // list of receivers
    subject: "PineShop OTP Verification", // Subject line
    text: `Your OTP is ${otp}`, // plain text body
    html: `<div style="max-width:600px;margin:20px auto;background:#fff;padding:20px;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.1);text-align:center;font-family:Arial,sans-serif;">
      <div style="font-size:24px;font-weight:bold;color:#4CAF50;">🌲 PineShop</div>
      <h2>Verify Your Email</h2>
      <p>Use the OTP below to verify your email address:</p>
      <div style="font-size:28px;font-weight:bold;color:#333;background:#f8f8f8;padding:10px 20px;display:inline-block;border-radius:5px;margin:20px 0;">${otp}</div>
      <p>If you didn't request this, please ignore this email.</p>
      <div style="font-size:12px;color:#777;margin-top:20px;">&copy; 2025 PineShop. All rights reserved.</div>
    </div>`, // html body
  });

  console.log("OTP sent: ", otp);

  await prisma.otp.create({
    data: {
      email: email,
      code: otp,
      userId: "",
    },
  });

  return { message: "OTP sent to your email" };
};