"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid gap-4">
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
  );
}
