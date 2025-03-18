"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import HomeHeader from "../_components/homeHeader";
import Discount from "../_components/paymentDiscount";

export default function Payment() {
  return (
    <div className="flex justify-center items-center flex-col ">
      <div>
        <HomeHeader />
        <Card className="mt-10">
          <CardHeader>
            <p className="font-extrabold">Захиалагчийн мэдээлэл</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 ">
            <p className="text-[14px] font-bold">Нэр</p>
            <Input placeholder="Нэр" type="text" className="w-80 " />
            <p className="text-[14px] font-bold">Овог</p>
            <Input placeholder="Овог" type="text" className="w-80" />
            <p className="text-[14px] font-bold">Утасны дугаар</p>
            <Input placeholder="Утасны дугаар" type="text" className="w-80" />
            <p className="text-[14px] font-bold"> И-мэйл</p>
            <Input placeholder="и-мэйл" type="text" className="w-80" />
          </CardContent>
          <CardFooter className="flex justify-center">
            <button className="border rounded-md h-8  w-40 bg-black text-white text-[14px] font-bold">
              Үргэлжлүүлэх
            </button>
          </CardFooter>
        </Card>
      </div>
      <Discount />
    </div>
  );
}
