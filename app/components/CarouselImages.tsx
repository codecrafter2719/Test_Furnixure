"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Carousel {
  id: string;
  image_urls: string[];
}

export default function CarouselImages() {
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCarousels();
  }, []);

  const fetchCarousels = async () => {
    try {
      const { data, error } = await supabase
        .from('carousel')
        .select('id, image_urls')
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-video bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  if (carousels.length === 0) {
    return null;
  }

  // Flatten all carousel images into a single array
  const allImages = carousels.flatMap(carousel => carousel.image_urls);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {allImages.map((url, index) => (
          <div key={index} className="relative aspect-video group">
            <img
              src={url}
              alt={`Carousel image ${index + 1}`}
              className="rounded-lg object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
} 