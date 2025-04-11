"use client";

import React, { useState, useEffect } from "react";

export default function ViewItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const storeID = localStorage.getItem("storeID") || "";

  useEffect(() => {
    if (!storeID) return;

    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/view-items?storeID=${storeID}`);
        const data = await response.json();
        if (response.ok) {
          setItems(data.items);
        } else {
          alert(data.message || "Error fetching items");
        }
      } catch (error: any) {
        alert(`Error: ${error.message}`);
      }
    };

    fetchItems();
  }, [storeID]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8">
      <h2 className="text-3xl font-bold text-[#0F6466] mb-6">View All Items</h2>

      {items.length === 0 ? (
        <p className="text-lg text-gray-600">No items found in this store.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold text-[#0F6466]">{item.itemName}</h3>
              <p className="text-gray-600 mt-2">{item.itemDescription}</p>
              <p className="text-lg font-bold text-green-500 mt-4">${item.itemPrice}</p>

              {/* Display the image just like in the profile page */}
              {item.itemImage ? (
                <img
                  src={item.itemImage} // This should already be base64 string from MongoDB
                  alt={item.itemName}
                  className="mt-4 w-full h-auto rounded object-cover"
                />
              ) : (
                <p className="text-sm text-gray-500 mt-2">No image available</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
