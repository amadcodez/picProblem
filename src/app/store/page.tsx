"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StorePage() {
  const [storeID, setStoreID] = useState("");
  const [storeData, setStoreData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("storeID");
    if (stored) {
      setStoreID(stored);
      fetchStoreData(stored);
    }
  }, []);

  const fetchStoreData = async (id: string) => {
    const res = await fetch(`/api/get-store?storeID=${id}`);
    const data = await res.json();
    setStoreData(data.store);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-[#0F6466] mb-4 text-center">Store Details</h2>

        {storeData ? (
          <div className="mb-6">
            <p className="text-[#317274] font-medium"><strong>Store Name:</strong> {storeData.storeName}</p>
            <p className="text-[#317274] font-medium"><strong>Item Type:</strong> {storeData.itemType}</p>
            <p className="text-[#317274] font-medium"><strong>Location:</strong> {storeData.location}</p>
            <p className="text-[#317274] font-medium"><strong>Categories:</strong> {storeData.numCategories}</p>
          </div>
        ) : (
          <p>Loading store info...</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => router.push("/store/add-item")}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Add Item
          </button>
          <button
            onClick={() => router.push("/store/view-items")}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            View All Items
          </button>
          <button
            onClick={() => router.push("/store/delete-item")}
            className="bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Delete Item
          </button>
          <button
            onClick={() => router.push("/store/update-item")}
            className="bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
          >
            Update Item
          </button>
        </div>
      </div>
    </div>
  );
}
