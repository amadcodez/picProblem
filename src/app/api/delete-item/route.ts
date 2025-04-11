import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/db";
import { Item } from "@/models/Item";

export async function DELETE(req: Request) {
  const { storeID, itemID } = await req.json();

  if (!storeID || !itemID) {
    return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
  }

  try {
    await connectToDB(); // Connect to MongoDB
    const deletedItem = await Item.findOneAndDelete({ _id: itemID, storeID });

    if (!deletedItem) {
      return NextResponse.json({ message: "Item not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Item deleted successfully!" });
  } catch (error) {
    // TypeScript: assert error as an instance of Error
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: "An unknown error occurred." }, { status: 500 });
    }
  }
}
