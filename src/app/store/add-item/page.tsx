"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddItemPage() {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState(0);
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const storeID = localStorage.getItem("storeID") || "";

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeID) {
      alert("Store ID not found. Please create a store first.");
      return;
    }

    // Convert the image file to base64 string
    if (itemImage) {
      const reader = new FileReader();
      reader.readAsDataURL(itemImage);
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        const formData = {
          storeID,
          itemName,
          itemDescription,
          itemPrice,
          itemImage: base64Image, // Add base64 image here
        };

        try {
          const response = await fetch("/api/add-item", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message || "Failed to add item");

          setSuccessMessage("Item Added Successfully!");
          setItemName("");
          setItemDescription("");
          setItemPrice(0);
          setItemImage(null);

          setTimeout(() => {
            setSuccessMessage("");
            router.push("/store"); // Redirect to the store page
          }, 2000);
        } catch (error: any) {
          alert(`Error: ${error.message}`);
        }
      };
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#0F6466]">Add Item</h2>

        {successMessage && (
          <div className="bg-green-100 text-green-800 p-2 rounded mb-4 text-center">{successMessage}</div>
        )}

        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Item Name</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Item Description</label>
            <textarea
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Item Price</label>
            <input
              type="number"
              value={itemPrice}
              onChange={(e) => setItemPrice(Number(e.target.value))}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Item Image</label>
            <input
              type="file"
              onChange={(e) => setItemImage(e.target.files ? e.target.files[0] : null)}
              accept="image/*"
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-[#0F6466] text-white w-full py-2 px-4 rounded hover:bg-[#0e4f50]"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
}
