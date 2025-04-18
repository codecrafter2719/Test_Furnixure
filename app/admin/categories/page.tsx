"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
}

interface SubCategory {
  id: string;
  category_id: string;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
}

export default function ViewCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: subcategoryData, error: subcategoryError } = await supabase
        .from('subcategories')
        .select('*');

      if (categoryError) throw categoryError;
      if (subcategoryError) throw subcategoryError;

      setCategories(categoryData || []);
      setSubcategories(subcategoryData || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category? This will also delete all associated subcategories.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .match({ id });

      if (error) throw error;

      setCategories(categories.filter(category => category.id !== id));
      setSubcategories(subcategories.filter(sub => sub.category_id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
      setError("Failed to delete category");
    }
  };

  const handleDeleteSubcategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('subcategories')
        .delete()
        .match({ id });

      if (error) throw error;

      setSubcategories(subcategories.filter(sub => sub.id !== id));
    } catch (err) {
      console.error('Error deleting subcategory:', err);
      setError("Failed to delete subcategory");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Loading categories...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
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
      <h1 className="text-2xl font-bold mb-6">View Categories</h1>
      
      {categories.length === 0 ? (
        <p className="text-gray-500">No categories found.</p>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                  <p className="text-gray-500 text-sm">
                    {new Date(category.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
              
              <p className="mb-4">{category.description}</p>
              <img
                src={category.image_url}
                alt={`Category image for ${category.name}`}
                className="rounded-lg object-cover w-full h-48 mb-4"
              />
              
              <h3 className="text-lg font-semibold mb-2">Subcategories</h3>
              <div className="space-y-4">
                {subcategories.filter(sub => sub.category_id === category.id).map((sub) => (
                  <div key={sub.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{sub.name}</h4>
                      <button
                        onClick={() => handleDeleteSubcategory(sub.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </p>
                    <p className="mb-2">{sub.description}</p>
                    <img
                      src={sub.image_url}
                      alt={`Subcategory image for ${sub.name}`}
                      className="rounded-lg object-cover w-full h-32"
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