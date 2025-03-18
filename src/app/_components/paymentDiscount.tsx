import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Discount() {
  return (
    <div className="flex justify-center items-center ">
      <div>
        <Card className="mt-10">
          <CardHeader>
            <p className="font-extrabold">Хүргэлтийн хаяг</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 ">
            <p className="text-[14px] font-bold">Хот</p>
            <Input type="text" className="w-80 " placeholder="Хот/Аймаг" />
            <p className="text-[14px] font-bold">Дүүрэг</p>
            <Input type="text" className="w-80" placeholder="Дүүрэг" />
            <p className="text-[14px] font-bold">Хороо</p>
            <Input type="text" className="w-80" placeholder="Хороо" />
            <p className="text-[14px] font-bold">Байр</p>
            <Input type="text" className="w-80" placeholder="Байр" />
            <p className="text-[14px] font-bold">Дэлгэрэнгүй хаяг</p>
            <textarea
              className="w-80 border rounded-md resize-none text-[14px]"
              placeholder="Дэлгэрэнгүй хаягаа бичнэ үү"
            ></textarea>
          </CardContent>
          <CardFooter className="flex justify-center">
            <button className="border rounded-md h-8  w-40 bg-black text-white text-[14px] font-bold">
              Хадгалах
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
