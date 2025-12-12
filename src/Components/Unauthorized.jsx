import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">403 - Unauthorized</h1>
      <p className="text-gray-600 mb-6">
        You do not have permission to view this page.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="px-6 py-2 bg-[#7B3FE4] text-white rounded-lg hover:bg-[#663bc9] transition-colors"
      >
        Go Back
      </button>
    </div>
  );
};

export default Unauthorized;