import React from "react";
import { FiBell } from "react-icons/fi";
import { HiOutlineMenu } from "react-icons/hi";

export default function Navbar({
  setSidebarToggle,
  isMobile = false,
  user = { name: "Marhaba Admin", role: "Admin", initials: "M" },
}) {
  const initials =
    user.initials ||
    user.name?.split(" ").map((s) => s[0]).slice(0, 2).join("") ||
    "U";

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm h-16 w-full">
      <header className="flex items-center justify-between h-full">
        {/* Left (aligned with sidebar) */}
        <div className={`flex items-center h-full ${isMobile ? "pl-6" : "pl-6 md:pl-[264px]"}`}>
          <button
            className="text-gray-600 p-2 hover:text-gray-800 transition-colors md:hidden"
            onClick={() => setSidebarToggle?.(prev => !prev)}
            aria-label="Toggle sidebar"
          >
            <HiOutlineMenu size={20} />
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 pr-6">
          {/* Bell */}
          <div className="relative">
            <FiBell
              className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
              size={20}
              aria-hidden="true"
            />
            {/* badge example (uncomment if needed) */}
            {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span> */}
          </div>

          {/* Vertical divider */}
          <div className="h-10 w-px bg-gray-300 mx-0" />

          {/* Profile block: single avatar + name/role */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative">
              <div
                className="w-9 h-9 bg-purple-600 text-white rounded-full cursor-pointer border-2 border-gray-200 flex items-center justify-center font-medium text-sm"
                title={user.name}
              >
                {initials}
              </div>
              {/* <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" /> */}
            </div>

            {/* Name + role (left-aligned, hidden on xs) */}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-medium text-gray-800 leading-none">{user.name}</span>
              <span className="text-xs text-gray-500 leading-none mt-[2px]">{user.role}</span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
