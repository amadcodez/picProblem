import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/db";
import { Item } from "@/models/Item";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { storeID, itemName, itemDescription, itemPrice, itemImage } = body;

    // Log the received image for debugging purposes
    console.log("Received itemImage:", itemImage); // Add logging to check if the base64 string is coming through

    // Validate the image format (optional)
    if (itemImage && !itemImage.startsWith("data:image")) {
      return NextResponse.json(
        { success: false, message: "Invalid image format." },
        { status: 400 }
      );
    }

    // Connect to DB
    await connectToDB();

    // Create a new item object
    const newItem = new Item({
      storeID,
      itemName,
      itemDescription,
      itemPrice,
      itemImage, // Save base64 image data in the database
    });

    // Save the item to the MongoDB collection
    await newItem.save();

    return NextResponse.json({
      success: true,
      message: "Item added successfully!",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}
