// src/Components/ErrorPage.jsx
import React from "react";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error("Route Error:", error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-4">
          {/* Show specific error message if available, otherwise default text */}
          {error?.statusText || error?.message || "We encountered an unexpected error."}
        </p>
        <div className="space-y-2">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mr-2"
          >
            Reload Page
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}