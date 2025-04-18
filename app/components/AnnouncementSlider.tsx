"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Announcement {
  id: string;
  image_urls: string[];
}

export default function AnnouncementSlider() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === announcements.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [announcements.length]);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('id, image_urls')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return null;
  }

  // Flatten all image URLs from all announcements
  const allImages = announcements.flatMap(announcement => announcement.image_urls);
  const currentImage = allImages[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="relative w-full h-48 overflow-hidden rounded-lg shadow-lg">
        <img
          src={currentImage}
          alt="Announcement"
          className="w-full h-full object-cover"
        />
        
        {/* Navigation dots */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
          {allImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 