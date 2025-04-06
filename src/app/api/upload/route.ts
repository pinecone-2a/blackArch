import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    // In a real app, you would upload these files to a cloud storage service
    // like AWS S3, Google Cloud Storage, or Cloudinary
    // For this example, we'll save them to the public directory
    
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create a unique filename
      const fileName = `${uuidv4()}_${file.name.replace(/\s/g, "-")}`;
      const filePath = path.join(process.cwd(), "public", "uploads", fileName);
      
      // Save the file
      await writeFile(filePath, buffer);
      
      // Generate URL for the file
      const fileUrl = `/uploads/${fileName}`;
      uploadedUrls.push(fileUrl);
    }

    return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json(
      { error: "Error uploading images" },
      { status: 500 }
    );
  }
} 