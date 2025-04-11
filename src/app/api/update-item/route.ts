import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/db";
import { Item } from "@/models/Item";

export async function PUT(req: Request) {
  const { storeID, itemID, updatedItemName, updatedItemDescription, updatedItemPrice } = await req.json();

  if (!storeID || !itemID || !updatedItemName || !updatedItemDescription || !updatedItemPrice) {
    return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
  }

  try {
    await connectToDB(); // Connect to MongoDB
    const updatedItem = await Item.findOneAndUpdate(
      { _id: itemID, storeID },
      { itemName: updatedItemName, itemDescription: updatedItemDescription, itemPrice: updatedItemPrice },
      { new: true } // Return the updated document
    );

    if (!updatedItem) {
      return NextResponse.json({ message: "Item not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Item updated successfully!", item: updatedItem });
  } catch (error) {
    if (error instanceof Error) {
      // Error is an instance of Error, so we can safely access 'message'
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      // In case it's not an instance of Error (which shouldn't happen in most cases)
      return NextResponse.json({ message: "An unknown error occurred." }, { status: 500 });
    }
  }
}
