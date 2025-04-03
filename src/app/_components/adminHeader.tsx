import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, ChevronDown, Bell, LogOut, ChevronRight } from "lucide-react";

export default function AdminHeader() {
  return (
    <div className="relative bg-white mx-auto h-[96px] rounded-br-2xl justify-between flex rounded-bl-2xl w-11/12 shadow-md">
      <p className="text-2xl font-bold items-center flex ml-8 ">PINESHOP</p>
      <div className="flex gap-5 items-center my-4 mr-4 justify-end">
        <Sheet>
          <SheetTrigger>
            {" "}
            <Bell className="w-8 h-8 cursor-pointer" />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
              <SheetDescription className="h-[1px] w-[90%] bg-gray-500 mx-auto my-5"></SheetDescription>
            </SheetHeader>
            <div> item Notifications </div>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger className="bg-black text-white rounded-2xl text-xl font-semibold w-40 h-11 flex items-center justify-center ">
            ADMIN
            <ChevronDown className="text-white" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-60 h-36">
            <DropdownMenuLabel className="text-lg font-bold w-[80%] mx-auto">
              ADMIN
            </DropdownMenuLabel>
            <DropdownMenuItem className="text-lg flex mx-auto justify-between w-[80%]">
              Change Password <ChevronRight />
            </DropdownMenuItem>
            <DropdownMenuItem className="text-lg flex mx-auto justify-between w-[80%]">
              Log out <LogOut />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
