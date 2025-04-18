"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/lib/supabase";

interface Category {
  id: string;
  name: string;
}

interface SubCategory {
  id: string;
  category_id: string;
  name: string;
}

export default function AddProduct() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    onDrop: (acceptedFiles) => {
      setImages(acceptedFiles);
    }
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('id, name');
      if (error) console.error('Error fetching categories:', error);
      else setCategories(data || []);
    };

    const fetchSubcategories = async () => {
      const { data, error } = await supabase.from('subcategories').select('id, category_id, name');
      if (error) console.error('Error fetching subcategories:', error);
      else setSubcategories(data || []);
    };

    fetchCategories();
    fetchSubcategories();
  }, []);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError("");

    try {
      if (images.length === 0) {
        throw new Error("Please select at least one image");
      }

      // Upload images to Cloudinary
      const imageUrls = await Promise.all(images.map((image) => uploadToCloudinary(image)));

      // Store product data in Supabase
      const { error: supabaseError } = await supabase
        .from('products')
        .insert([
          {
            name,
            price,
            description,
            size,
            additional_info: additionalInfo,
            category_id: categoryId,
            subcategory_id: subcategoryId || null,
            image_urls: imageUrls,
            created_at: new Date().toISOString(),
          },
        ]);

      if (supabaseError) throw supabaseError;

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to create product. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => router.push('/admin/dashboard')}
        className="mb-6 text-blue-500 hover:text-blue-700 flex items-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </button>
      
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Size</label>
          <input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Additional Information</label>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        {subcategories.some(sub => sub.category_id === categoryId) && (
          <div>
            <label className="block text-sm font-medium mb-2">Subcategory</label>
            <select
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a subcategory</option>
              {subcategories.filter(sub => sub.category_id === categoryId).map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Product Images</label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the images here...</p>
            ) : (
              <p>Drag and drop images here, or click to select files</p>
            )}
          </div>
          {images.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                {images.length} image(s) selected
              </p>
            </div>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-2 px-4 rounded ${
            uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-600'
          } text-white font-medium`}
        >
          {uploading ? 'Creating Product...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
} 