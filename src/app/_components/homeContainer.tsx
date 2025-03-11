import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HomeContainer() {
  return (
    <div className="relative h-screen ">
      <Image
        src="/ger.png"
        width={1920}
        height={1080}
        alt="yurt"
        className="w-full h-full object-cover"
        style={{ objectPosition: "75% 50%" }}
      />
      <div className="absolute inset-0 flex mb-[300px] flex-col items-center justify-center text-white text-center px-4 py-8 md:px-8 md:py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
          WELCOME TO <br /> GROOVY YURTS!
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light mb-6">
          A yurt - or ger - is the home of the Mongolian nomads. Its history dates
          back thousands of years and yurts are still widely in use year-round across
          Mongolia. Our beautiful traditional yurts are made using mostly natural products,
          hand-crafted by a Mongolian family on the principle of fair trade. Gers are
          sustainable dwellings, designed intentionally to not harm the earth, and are
          comprised of organic materials like felt insulation and horse hair ropes.
        </p>
        <div className="flex justify-center mt-4">
          <Button className="w-[300px] sm:w-[350px] h-12 rounded-2xl text-xl font-semibold ">
            Shop Now
          </Button>
        </div>
      </div>
    </div>
  )
}
