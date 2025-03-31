"use client";

import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import HomeHeader from "@/app/_components/homeHeader";

const cities = [
  {
    name: "Улаанбаатар",
    districts: [
      "Багануур",
      "Багахангай",
      "Баянгол",
      "Баянзүрх",
      "Налайх",
      "Сонгинохайрхан",
      "Сүхбаатар",
      "Чингэлтэй",
      "Хан-Уул",
    ],
  },

  { name: "Дархан-Уул", districts: ["Дархан", "Шарын гол"] },

  { name: "Орхон", districts: ["Баян-Өндөр", "Жаргалант"] },
];

export default function Discount() {
  const [formData, setFormData] = useState({
    city: "",

    district: "",

    khoroo: "",

    building: "",

    address: "",
  });

  const [errors, setErrors] = useState({
    city: "",

    district: "",

    khoroo: "",

    building: "",

    address: "",
  });

  useEffect(() => {
    const savedData = localStorage.getItem("addressData");

    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("addressData", JSON.stringify(formData));
  }, [formData]);

  const validate = () => {
    let newErrors = {
      city: "",
      district: "",
      khoroo: "",
      building: "",
      address: "",
    };

    let isValid = true;

    if (!formData.city) {
      newErrors.city = "Хот/Аймаг сонгоно уу";

      isValid = false;
    }

    if (!formData.district) {
      newErrors.district = "Дүүрэг сонгоно уу";

      isValid = false;
    }

    if (!formData.khoroo.trim()) {
      newErrors.khoroo = "Хороо оруулна уу";

      isValid = false;
    }

    if (!formData.building.trim()) {
      newErrors.building = "Байр оруулна уу";

      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = "Дэлгэрэнгүй хаягаа бичнэ үү";

      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = () => {
    if (validate()) {
      alert("Хаяг хадгалагдлаа!");
    }
  };

  const selectedCity = cities.find((c) => c.name === formData.city);

  return (
    <div className="flex justify-center items-center">
      <div>
        <HomeHeader />
        <Card className="mt-10">
          <CardHeader>
            <p className="font-extrabold">Хүргэлтийн хаяг</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-[14px] font-bold">Хот</p>
            <select
              className="w-80 border p-2 rounded-md max-h-60 overflow-auto"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value, district: "" })
              }
            >
              <option value="">Хот/Аймаг сонгох</option>

              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>

            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city}</p>
            )}
            <p className="text-[14px] font-bold">Дүүрэг</p>
            <select
              className="w-80 border p-2 rounded-md"
              value={formData.district}
              onChange={(e) =>
                setFormData({ ...formData, district: e.target.value })
              }
              disabled={!formData.city}
            >
              <option value="">Дүүрэг сонгох</option>

              {selectedCity?.districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>

            {errors.district && (
              <p className="text-red-500 text-sm">{errors.district}</p>
            )}
            <p className="text-[14px] font-bold">Хороо</p>
            <Input
              type="text"
              className="w-80"
              placeholder="Хороо"
              value={formData.khoroo}
              onChange={(e) =>
                setFormData({ ...formData, khoroo: e.target.value })
              }
            />

            {errors.khoroo && (
              <p className="text-red-500 text-sm">{errors.khoroo}</p>
            )}
            <p className="text-[14px] font-bold">Байр</p>
            <Input
              type="text"
              className="w-80"
              placeholder="Байр"
              value={formData.building}
              onChange={(e) =>
                setFormData({ ...formData, building: e.target.value })
              }
            />

            {errors.building && (
              <p className="text-red-500 text-sm">{errors.building}</p>
            )}
            <p className="text-[14px] font-bold">Дэлгэрэнгүй хаяг</p>
            <textarea
              className="w-80 border rounded-md resize-none text-[14px] p-2"
              placeholder="Дэлгэрэнгүй хаягаа бичнэ үү"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            ></textarea>

            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <button
              className="border rounded-md h-8 w-40 bg-black text-white text-[14px] font-bold"
              onClick={handleSubmit}
            >
              Хадгалах
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
