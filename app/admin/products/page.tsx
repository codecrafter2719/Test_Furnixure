"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  size: string;
  additional_info: string;
  category_id: string;
  subcategory_id: string | null;
  image_urls: string[];
  created_at: string;
}

interface Category {
  id: string;
  name: string;
}

interface SubCategory {
  id: string;
  name: string;
}

export default function ViewProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [subcategories, setSubcategories] = useState<Record<string, SubCategory>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      // Fetch products
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch categories
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id, name');

      // Fetch subcategories
      const { data: subcategoryData, error: subcategoryError } = await supabase
        .from('subcategories')
        .select('id, name');

      if (productError) throw productError;
      if (categoryError) throw categoryError;
      if (subcategoryError) throw subcategoryError;

      // Convert arrays to records for easy lookup
      const categoryMap = categoryData.reduce((acc, category) => {
        acc[category.id] = category;
        return acc;
      }, {} as Record<string, Category>);

      const subcategoryMap = subcategoryData.reduce((acc, subcategory) => {
        acc[subcategory.id] = subcategory;
        return acc;
      }, {} as Record<string, SubCategory>);

      setProducts(productData || []);
      setCategories(categoryMap);
      setSubcategories(subcategoryMap);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .match({ id });

      if (error) throw error;

      setProducts(products.filter(product => product.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      setError("Failed to delete product");
    }
  };

  useEffect(() => {
    fetchData();
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
        <h1 className="text-2xl font-bold mb-6">Loading products...</h1>
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
      <h1 className="text-2xl font-bold mb-6">View Products</h1>
      
      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="space-y-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <p className="text-gray-500 text-sm">
                    {new Date(product.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-lg font-medium mb-2">Rs:{product.price.toFixed(2)}</p>
                  <p className="mb-4">{product.description}</p>
                  
                  {product.size && (
                    <p className="mb-2">
                      <span className="font-medium">Size:</span> {product.size}
                    </p>
                  )}
                  
                  {product.additional_info && (
                    <p className="mb-2">
                      <span className="font-medium">Additional Info:</span> {product.additional_info}
                    </p>
                  )}
                  
                  <div className="mt-4">
                    <p className="font-medium">Category:</p>
                    <p>{categories[product.category_id]?.name || 'Unknown Category'}</p>
                    
                    {product.subcategory_id && (
                      <>
                        <p className="font-medium mt-2">Subcategory:</p>
                        <p>{subcategories[product.subcategory_id]?.name || 'Unknown Subcategory'}</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {product.image_urls.map((url, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={url}
                        alt={`Product image ${index + 1}`}
                        className="rounded-lg object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 