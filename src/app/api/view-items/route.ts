import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/db";
import { Item } from "@/models/Item";

export async function GET(req: Request) {
  const url = new URL(req.url);  // Using the URL constructor to properly parse query params
  const storeID = url.searchParams.get('storeID');  // Retrieve 'storeID' query parameter

  if (!storeID) {
    return NextResponse.json({ message: "Store ID is required." }, { status: 400 });
  }

  try {
    await connectToDB(); // Connect to MongoDB
    const items = await Item.find({ storeID });

    if (items.length === 0) {
      return NextResponse.json({ message: "No items found for this store." }, { status: 404 });
    }

    return NextResponse.json({ items });
  } catch (error) {
    // Error handling with type guard
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: "An unknown error occurred." }, { status: 500 });
    }
  }
}
