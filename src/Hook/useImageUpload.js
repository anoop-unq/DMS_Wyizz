import { useState } from "react";

export function useImageUpload() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const uploadImage = async (file, uploadUrl) => {
    if (!file || !uploadUrl) {
      throw new Error("No file or upload URL provided");
    }
    console.log(uploadUrl, "uploadUrl in useImageUpload");

    const formData = new FormData();
    formData.append("file", file);
    
    console.log("🔄 Starting upload...");
    console.log("📤 Upload URL:", `${apiUrl}/${uploadUrl}`);
    console.log("📎 File:", file.name, file.type, file.size);
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/${uploadUrl}`, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header for FormData - browser will set it automatically with boundary
      });

      console.log("📡 Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Upload failed:", errorText);
        throw new Error(`Upload failed! Status: ${response.status}`);
      }

      const json = await response.json();
      console.log("✅ Upload successful:", json);
      setData(json);
      return json;
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError(err.message || "Image upload failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, uploadImage };
}