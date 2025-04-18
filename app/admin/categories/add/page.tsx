"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/lib/supabase";

interface SubCategory {
  name: string;
  description: string;
  image: File | null;
}

export default function AddCategory() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setImage(acceptedFiles[0]);
      }
    }
  });

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

  const addSubcategory = () => {
    setSubcategories([...subcategories, { name: '', description: '', image: null }]);
  };

  const removeSubcategory = (index: number) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  const updateSubcategory = (index: number, field: keyof SubCategory, value: any) => {
    const updatedSubcategories = [...subcategories];
    updatedSubcategories[index] = { ...updatedSubcategories[index], [field]: value };
    setSubcategories(updatedSubcategories);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError("");

    try {
      if (!image) {
        throw new Error("Please select a category image");
      }

      // Upload main category image
      const categoryImageUrl = await uploadToCloudinary(image);

      // Insert main category
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .insert([
          {
            name,
            description,
            image_url: categoryImageUrl,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (categoryError) throw categoryError;

      // Upload and insert subcategories
      if (subcategories.length > 0) {
        const subcategoryPromises = subcategories.map(async (sub) => {
          if (!sub.image) {
            throw new Error(`Please select an image for subcategory: ${sub.name}`);
          }
          const imageUrl = await uploadToCloudinary(sub.image);
          return {
            category_id: categoryData[0].id,
            name: sub.name,
            description: sub.description,
            image_url: imageUrl,
            created_at: new Date().toISOString(),
          };
        });

        const subcategoryData = await Promise.all(subcategoryPromises);
        const { error: subcategoryError } = await supabase
          .from('subcategories')
          .insert(subcategoryData);

        if (subcategoryError) throw subcategoryError;
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to create category. Please try again.");
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
      
      <h1 className="text-2xl font-bold mb-6">Add New Category</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4">Main Category</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              <label className="block text-sm font-medium mb-2">Category Image</label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                  ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the image here...</p>
                ) : (
                  <p>Drag and drop an image here, or click to select</p>
                )}
              </div>
              {image && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Selected image: {image.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Subcategories</h2>
            <button
              type="button"
              onClick={addSubcategory}
              className="text-blue-500 hover:text-blue-700"
            >
              + Add Subcategory
            </button>
          </div>

          {subcategories.map((subcategory, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium">Subcategory {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeSubcategory(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={subcategory.name}
                    onChange={(e) => updateSubcategory(index, 'name', e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={subcategory.description}
                    onChange={(e) => updateSubcategory(index, 'description', e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      updateSubcategory(index, 'image', file);
                    }}
                    className="w-full"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
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
              : 'bg-purple-500 hover:bg-purple-600'
          } text-white font-medium`}
        >
          {uploading ? 'Creating Category...' : 'Create Category'}
        </button>
      </form>
    </div>
  );
} 