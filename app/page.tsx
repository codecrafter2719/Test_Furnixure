// export default function Home() {
//   return (
//     <div>
//       <h1>Home</h1>
//     </div>
//   );
// }

"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import CategoriesGrid from "./components/CategoriesGrid";
import AnnouncementSlider from "./components/AnnouncementSlider";
import CarouselImages from "./components/CarouselImages";

export default function Home() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Outdoor Furniture
          </h1>
          {isSignedIn ? (
            <p className="text-xl text-gray-600">
              Welcome back, {user.firstName}!
            </p>
          ) : (
            <div className="space-x-4">
              <Link
                href="/sign-in"
                className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {isSignedIn && (
          <div className="text-center mb-8">
            <Link
              href="/admin/dashboard"
              className="inline-block bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Go to Admin
            </Link>
          </div>
        )}

        <AnnouncementSlider />

        <CategoriesGrid />

        <CarouselImages />
      </div>
    </div>
  );
}
