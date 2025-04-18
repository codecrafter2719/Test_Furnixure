"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface SubCategory {
  id: string;
  name: string;
  image_url: string;
}

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_urls: string[];
}

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.categoryId as string;
  
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  const fetchData = async () => {
    try {
      // Fetch category details
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id, name')
        .eq('id', categoryId)
        .single();

      // Fetch subcategories
      const { data: subcategoryData, error: subcategoryError } = await supabase
        .from('subcategories')
        .select('id, name, image_url')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });

      // Fetch products directly from category if no subcategories
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('id, name, price, image_urls')
        .eq('category_id', categoryId)
        .is('subcategory_id', null)
        .order('created_at', { ascending: false });

      if (categoryError) throw categoryError;
      if (subcategoryError) throw subcategoryError;
      if (productError) throw productError;

      setCategory(categoryData);
      setSubcategories(subcategoryData || []);
      setProducts(productData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError("Failed to load category data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">{error}</h1>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-blue-500 hover:text-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Category not found</h1>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-blue-500 hover:text-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">{category.name}</h1>
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="text-blue-500 hover:text-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Show subcategories if they exist */}
      {subcategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subcategories.map((subcategory) => (
            <Link
              key={subcategory.id}
              href={`/categories/${category.id}/subcategories/${subcategory.id}`}
              className="relative h-48 rounded-lg overflow-hidden cursor-pointer group"
            >
              <img
                src={subcategory.image_url}
                alt={subcategory.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
                <h3 className="text-white text-xl font-semibold">{subcategory.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Show products directly if no subcategories */
        <div>
          {products.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-500">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer group"
                >
                  <div className="relative h-48">
                    <img
                      src={product.image_urls[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-lg font-bold text-indigo-600">
                      Rs: {product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 