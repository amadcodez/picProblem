import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  storeID: { type: String, required: true },
  itemName: { type: String, required: true },
  itemDescription: { type: String, required: true },
  itemPrice: { type: Number, required: true },
});

export const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);
