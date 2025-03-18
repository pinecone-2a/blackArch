"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Label } from "@/components/ui/label"

export default function AdminCategoryComp() {
  const [newCategory, setNewCategory] = useState<string>("");

//   const addCategory = () => {
//     fetch("http://localhost:5006/food-category/", {
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       method: "POST",
//       body: JSON.stringify({ categoryName: newCategory }),
//     });
//     setNewCategory(""); 
//   };

  return (
    <div className="w-11/12 p-6 rounded-xl min-h-[300px] flex flex-col gap-4">
      <h4 className="text-xl font-semibold">Dishes Category</h4>
      <div className="flex flex-wrap gap-3">
        <Link href={`/admin/menu`}>
          <Badge
            variant="outline"
            className="rounded-full border py-2 px-4 flex gap-2 text-sm font-medium"
          >
            All Oufits
          </Badge>
        </Link>
       
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="rounded-full bg-black hover:bg-gray-900 duration-300 p-[10px]">
              <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent className="flex flex-col rounded-3xl gap-6 w-[460px] p-6">
            <DialogHeader className="pb-4">
              <DialogTitle>Add new category</DialogTitle>
            </DialogHeader>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="categoryName">Category name</Label>
              <Input
                id="categoryName"
                type="text"
                className="w-[412px]"
                placeholder="Type category name..."
                onChange={(e) => setNewCategory(e.target.value)}
                required
                pattern="[A-Za-z0-9\s]+"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  className="bg-black text-white duration-200 border shadow-none"
                  type="submit"
                
                >
                  Add category
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
