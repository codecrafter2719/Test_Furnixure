"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid gap-4">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold mb-3">Announcements</h2>
          <div className="grid gap-3">
            <button
              onClick={() => router.push('/admin/announcements')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
            >
              Add Announcements
            </button>

            <button
              onClick={() => router.push('/admin/view-announcements')}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded"
            >
              View Announcements
            </button>
          </div>
        </div>

        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold mb-3">Categories</h2>
          <div className="grid gap-3">
            <button
              onClick={() => router.push('/admin/categories/add')}
              className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded"
            >
              Add Category
            </button>

            <button
              onClick={() => router.push('/admin/categories')}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded"
            >
              View Categories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
