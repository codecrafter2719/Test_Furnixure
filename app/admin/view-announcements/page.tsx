"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface Announcement {
  id: string;
  title: string;
  description: string;
  image_urls: string[];
  created_at: string;
}

export default function ViewAnnouncements() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .match({ id });

      if (error) throw error;
      
      // Refresh the announcements list
      setAnnouncements(announcements.filter(a => a.id !== id));
    } catch (err) {
      console.error('Error deleting announcement:', err);
      setError("Failed to delete announcement");
    }
  };

  useEffect(() => {
    fetchAnnouncements();
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
        <h1 className="text-2xl font-bold mb-6">Loading announcements...</h1>
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
      <h1 className="text-2xl font-bold mb-6">View Announcements</h1>
      
      {announcements.length === 0 ? (
        <p className="text-gray-500">No announcements found.</p>
      ) : (
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{announcement.title}</h2>
                  <p className="text-gray-500 text-sm">
                    {new Date(announcement.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(announcement.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
              
              <p className="mb-4">{announcement.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {announcement.image_urls.map((url, index) => (
                  <div key={index} className="relative aspect-video">
                    <img
                      src={url}
                      alt={`Announcement image ${index + 1}`}
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