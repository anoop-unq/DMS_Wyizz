import { useState } from "react";

export function usePut(url) {
  const [data, setData] = useState(null); // Store response data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error message string
  const apiUrl = import.meta.env.VITE_API_URL;

  const putData = async (body) => {
    console.log("PUT body", body);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/${url}`, {

        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      console.log(response,"Put Use")

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      setData(json);
      return json;
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, putData };
}
