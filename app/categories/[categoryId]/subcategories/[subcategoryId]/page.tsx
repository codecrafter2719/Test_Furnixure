"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  image_urls: string[];
}

interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

export default function SubCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.categoryId as string;
  const subcategoryId = params.subcategoryId as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategory, setSubcategory] = useState<SubCategory | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [categoryId, subcategoryId]);

  const fetchData = async () => {
    try {
      // Fetch category details
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id, name')
        .eq('id', categoryId)
        .single();

      // Fetch subcategory details
      const { data: subcategoryData, error: subcategoryError } = await supabase
        .from('subcategories')
        .select('id, name')
        .eq('id', subcategoryId)
        .single();

      // Fetch products for this subcategory
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('id, name, price, image_urls')
        .eq('subcategory_id', subcategoryId)
        .order('created_at', { ascending: false });

      if (categoryError) throw categoryError;
      if (subcategoryError) throw subcategoryError;
      if (productError) throw productError;

      setCategory(categoryData);
      setSubcategory(subcategoryData);
      setProducts(productData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError("Failed to load subcategory data");
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

  if (!category || !subcategory) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Subcategory not found</h1>
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
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Link
            href={`/categories/${category.id}`}
            className="text-blue-500 hover:text-blue-700"
          >
            {category.name}
          </Link>
          <span className="text-gray-500">/</span>
          <h1 className="text-3xl font-bold">{subcategory.name}</h1>
        </div>
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="text-blue-500 hover:text-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-500">No products found in this subcategory.</p>
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
  );
} 