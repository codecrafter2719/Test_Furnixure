"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => router.push('/')}
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Home
        </button>
      </div>
      
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

        <div className="border-b pb-4 mb-4">
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

        <div className="border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold mb-3">Products</h2>
          <div className="grid gap-3">
            <button
              onClick={() => router.push('/admin/products/add')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded"
            >
              Add Product
            </button>

            <button
              onClick={() => router.push('/admin/products')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded"
            >
              View Products
            </button>
          </div>
        </div>

        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold mb-3">Carousel</h2>
          <div className="grid gap-3">
            <button
              onClick={() => router.push('/admin/carousel')}
              className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded"
            >
              Add Carousel
            </button>

            <button
              onClick={() => router.push('/admin/view-carousel')}
              className="bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 px-4 rounded"
            >
              View Carousel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
