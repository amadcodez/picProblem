"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UpdateItemPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [updatedItemName, setUpdatedItemName] = useState<string>("");
  const [updatedItemDescription, setUpdatedItemDescription] = useState<string>("");
  const [updatedItemPrice, setUpdatedItemPrice] = useState<number>(0);
  const storeID = localStorage.getItem("storeID") || "";
  const router = useRouter();

  useEffect(() => {
    if (!storeID) return;

    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/view-items?storeID=${storeID}`);
        const data = await response.json();
        if (response.ok) {
          setItems(data.items);
        } else {
          alert("Error fetching items");
        }
      } catch (error: any) {
        alert(`Error: ${error.message}`);
      }
    };

    fetchItems();
  }, [storeID]);

  const handleUpdateItem = async () => {
    if (!selectedItem) return alert("Please select an item to update.");

    try {
      const response = await fetch(`/api/update-item`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeID,
          itemID: selectedItem,
          updatedItemName,
          updatedItemDescription,
          updatedItemPrice,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Item updated successfully!");
        router.push("/store");
      } else {
        alert("Error updating item");
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h2 className="text-3xl font-bold text-[#005B5B] mb-6">Update Item</h2>

      {items.length === 0 ? (
        <p className="text-lg text-gray-600">No items found to update.</p>
      ) : (
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
          <select
            onChange={(e) => setSelectedItem(e.target.value)}
            className="mb-6 w-full p-3 border-2 border-[#0F6466] rounded-md text-[#0F6466] focus:outline-none focus:ring-2 focus:ring-[#0F6466] focus:border-transparent"
          >
            <option value="">Select an item to update</option>
            {items.map((item: any) => (
              <option key={item._id} value={item._id}>
                {item.itemName}
              </option>
            ))}
          </select>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 text-lg">Item Name</label>
              <input
                type="text"
                value={updatedItemName}
                onChange={(e) => setUpdatedItemName(e.target.value)}
                className="w-full p-3 border-2 border-[#0F6466] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F6466] focus:border-transparent"
                placeholder="Enter item name"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-lg">Item Description</label>
              <textarea
                value={updatedItemDescription}
                onChange={(e) => setUpdatedItemDescription(e.target.value)}
                className="w-full p-3 border-2 border-[#0F6466] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F6466] focus:border-transparent"
                placeholder="Enter item description"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-lg">Item Price</label>
              <input
                type="number"
                value={updatedItemPrice}
                onChange={(e) => setUpdatedItemPrice(Number(e.target.value))}
                className="w-full p-3 border-2 border-[#0F6466] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F6466] focus:border-transparent"
                placeholder="Enter item price"
              />
            </div>
          </div>

          <button
            onClick={handleUpdateItem}
            className="w-full mt-6 bg-[#0F6466] text-white py-3 rounded-md hover:bg-[#0e4f50] transition duration-300"
          >
            Update Item
          </button>
        </div>
      )}
    </div>
  );
}
