import { useState } from "react";

export function usePost(url) {
  const [data, setData] = useState(null); // Store response data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error message string
  const apiUrl = import.meta.env.VITE_API_URL;

  const postData = async (body) => {
    console.log("body", body);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log(apiUrl, "apiUrl in usePost");
      console.log(`${url}`, "url in usePost");
      const json = await response.json();
      setData(json);
      return json;
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, postData };
}
