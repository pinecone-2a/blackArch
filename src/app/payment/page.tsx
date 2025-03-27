"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import HomeHeader from "../_components/homeHeader";
export default function Payment() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
  });
  const validate = () => {
    let newErrors = { name: "", surname: "", phone: "", email: "" };
    let isValid = true;
    if (!formData.name.trim()) {
      newErrors.name = "Нэрээ оруулна уу";
      isValid = false;
    }
    if (!formData.surname.trim()) {
      newErrors.surname = "Овгоо оруулна уу";
      isValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Утасны дугаар оруулна уу";
      isValid = false;
    } else if (!/^\d{8}$/.test(formData.phone)) {
      newErrors.phone = "Утасны дугаар 8 оронтой байх ёстой";
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "И-мэйл хаяг оруулна уу";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Буруу и-мэйл хаяг";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  const handleSubmit = () => {
    if (validate()) {
      router.push("/payment/paymentDiscount");
    }
  };
  return (
    <div className="flex justify-center items-center flex-col">
      <div>
        <HomeHeader />
        <Card className="mt-10">
          <CardHeader>
            <p className="font-extrabold">Захиалагчийн мэдээлэл</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-[14px] font-bold">Нэр</p>
            <Input
              placeholder="Нэр"
              type="text"
              className="w-80"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
            <p className="text-[14px] font-bold">Овог</p>
            <Input
              placeholder="Овог"
              type="text"
              className="w-80"
              value={formData.surname}
              onChange={(e) =>
                setFormData({ ...formData, surname: e.target.value })
              }
            />
            {errors.surname && (
              <p className="text-red-500 text-sm">{errors.surname}</p>
            )}
            <p className="text-[14px] font-bold">Утасны дугаар</p>
            <Input
              placeholder="Утасны дугаар"
              type="text"
              className="w-80"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value.replace(/\D/g, ""),
                })
              }
              maxLength={8}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
            <p className="text-[14px] font-bold">И-мэйл</p>
            <Input
              placeholder="И-мэйл"
              type="text"
              className="w-80"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <button
              className="border rounded-md h-8 w-40 bg-black text-white text-[14px] font-bold"
              onClick={handleSubmit}
            >
              Үргэлжлүүлэх
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
