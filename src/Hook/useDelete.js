import { useState } from "react";

export function useDelete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const deleteData = async (endpoint) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/${endpoint}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return true; // return success flag
    } catch (err) {
      setError(err.message || "Something went wrong");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, deleteData };
}
