import { useState } from "react";

export function useFileUpload() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const uploadFile = async (file, uploadUrl) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', file.name, 'to:', `${apiUrl}/${uploadUrl}`);

      const response = await fetch(`${apiUrl}/${uploadUrl}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log('Upload response:', result);

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! Status: ${response.status}`);
      }

      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || "File upload failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, uploadFile };
}


