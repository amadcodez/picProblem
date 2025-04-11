"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DeleteItemPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // To handle loading state
  const [error, setError] = useState<string | null>(null); // To handle error message
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

  const handleDeleteItem = async (itemID: string) => {
    setLoading(true); // Start loading state
    setError(null); // Clear any previous errors

    try {
      const response = await fetch(`/api/delete-item`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeID, itemID }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Item deleted successfully!");
        setItems(items.filter(item => item._id !== itemID)); // Remove item from state
      } else {
        setError("Error deleting item: " + data.message);
      }
    } catch (error: any) {
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8">
      <h2 className="text-3xl font-bold text-[#0F6466] mb-6">Delete Item</h2>

      {items.length === 0 ? (
        <p className="text-lg text-gray-600">No items found to delete.</p>
      ) : (
        <div className="w-full max-w-5xl bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#0F6466] text-white">
                <th className="px-4 py-2 text-left">Item Name</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{item.itemName}</td>
                  <td className="px-4 py-2">{item.itemDescription}</td>
                  <td className="px-4 py-2 text-green-500">${item.itemPrice}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className={`text-white py-2 px-4 rounded-md ${loading ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"} transition duration-200`}
                      disabled={loading}
                    >
                      {loading ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      )}
    </div>
  );
}
