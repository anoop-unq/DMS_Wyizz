import React from "react";
import { FiBell } from "react-icons/fi";
import { HiOutlineMenu } from "react-icons/hi";
import { useAuthContext } from "../context/AuthContext"; 

export default function Navbar({
  setSidebarToggle,
  isMobile = false,
}) {
  const { userType, profile } = useAuthContext();

  const currentUser = {
    name: profile?.name || "",
    
    role: userType 
      ? userType.charAt(0).toUpperCase() + userType.slice(1) 
      : "",

    initials: profile?.name
      ? profile.name
          .split(" ")
          .map((s) => s[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "",

    // ✅ Updated to prepend the API base URL for images
    image: profile?.profile_image 
      ? `https://uat-api.marhabaqr.com/file/${profile.profile_image}` 
      : null,
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm h-16 w-full">
      <header className="flex items-center justify-between h-full">
        {/* Left Side */}
        <div className={`flex items-center h-full ${isMobile ? "pl-6" : "pl-6 md:pl-[264px]"}`}>
          <button
            className="text-gray-600 p-2 hover:text-gray-800 transition-colors md:hidden"
            onClick={() => setSidebarToggle?.((prev) => !prev)}
            aria-label="Toggle sidebar"
          >
            <HiOutlineMenu size={20} />
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 pr-6">
          <div className="relative">
            <FiBell
              className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
              size={20}
            />
          </div>

          <div className="h-10 w-px bg-gray-300 mx-0" />

          <div className="flex items-center gap-3">
            <div className="relative">
              {/* ✅ Priorities the constructed full URL */}
              {currentUser.image ? (
                <img
                  src={currentUser.image}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full cursor-pointer border-2 border-gray-200 object-contain"
                  title={currentUser.name}
                  // Optional: fallback if image fails to load from the URL
                  onError={(e) => { e.target.style.display = 'none'; }} 
                />
              ) : (
                <div
                  className="w-9 h-9 bg-purple-600 text-white rounded-full cursor-pointer border-2 border-gray-200 flex items-center justify-center font-medium text-sm"
                  title={currentUser.name}
                >
                  {currentUser.initials}
                </div>
              )}
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-medium text-gray-800 leading-none">
                {currentUser.name}
              </span>
              <span className="text-xs text-gray-500 leading-none mt-[2px]">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}