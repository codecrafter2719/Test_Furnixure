"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Carousel {
  id: string;
  name: string;
  image_urls: string[];
  created_at: string;
}

export default function ViewCarousel() {
  const router = useRouter();
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCarousels = async () => {
    try {
      const { data, error } = await supabase
        .from('carousel')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCarousels(data || []);
    } catch (err) {
      console.error('Error fetching carousels:', err);
      setError("Failed to load carousels");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this carousel?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('carousel')
        .delete()
        .match({ id });

      if (error) throw error;
      
      setCarousels(carousels.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting carousel:', err);
      setError("Failed to delete carousel");
    }
  };

  useEffect(() => {
    fetchCarousels();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="mb-6 text-blue-500 hover:text-blue-700 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold mb-6">Loading carousels...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="mb-6 text-blue-500 hover:text-blue-700 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold mb-6">Error</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => router.push('/admin/dashboard')}
        className="mb-6 text-blue-500 hover:text-blue-700 flex items-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-6">View Carousels</h1>
      
      {carousels.length === 0 ? (
        <p className="text-gray-500">No carousels found.</p>
      ) : (
        <div className="space-y-6">
          {carousels.map((carousel) => (
            <div key={carousel.id} className="border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{carousel.name}</h2>
                  <p className="text-gray-500 text-sm">
                    {new Date(carousel.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(carousel.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {carousel.image_urls.map((url, index) => (
                  <div key={index} className="relative aspect-video">
                    <img
                      src={url}
                      alt={`Carousel image ${index + 1}`}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 