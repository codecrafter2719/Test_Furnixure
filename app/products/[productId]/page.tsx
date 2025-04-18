"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_urls: string[];
  category_id: string;
  subcategory_id: string | null;
}

interface Category {
  id: string;
  name: string;
}

interface SubCategory {
  id: string;
  name: string;
}

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<SubCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [productId]);

  const fetchData = async () => {
    try {
      // Fetch product details
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (productError) throw productError;

      // Fetch category details
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id, name')
        .eq('id', productData.category_id)
        .single();

      if (categoryError) throw categoryError;

      // Fetch subcategory details if exists
      let subcategoryData = null;
      if (productData.subcategory_id) {
        const { data, error: subcategoryError } = await supabase
          .from('subcategories')
          .select('id, name')
          .eq('id', productData.subcategory_id)
          .single();

        if (subcategoryError) throw subcategoryError;
        subcategoryData = data;
      }

      setProduct(productData);
      setCategory(categoryData);
      setSubcategory(subcategoryData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
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

  if (!product || !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
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
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-blue-500">Home</Link>
          <span>/</span>
          <Link href={`/categories/${category.id}`} className="hover:text-blue-500">
            {category.name}
          </Link>
          {subcategory && (
            <>
              <span>/</span>
              <Link 
                href={`/categories/${category.id}/subcategories/${subcategory.id}`}
                className="hover:text-blue-500"
              >
                {subcategory.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {product.image_urls.map((url, index) => (
            <div key={index} className="relative h-96 rounded-lg overflow-hidden">
              <img
                src={url}
                alt={`${product.name} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-indigo-600 mb-6">
            Rs: {product.price.toFixed(2)}
          </p>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 