// hooks/useQuizApi.js
import { useState } from "react";

export const useQuizApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Update Question
  const updateQuestion = async (questionId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/quiz-question/update/${questionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Create Question
  const createQuestion = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/quiz-question/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { updateQuestion, createQuestion, loading, error };
};
