import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import {
  Home,
  BarChart3,
  Warehouse,
  UserCheck,
  Megaphone,
  Users,
  Building,
  CreditCard,
  Settings,
  LogOut, // Added LogOut icon
} from "lucide-react";
import { assets } from "../assets/assets";
import { useAuth } from "../Hook/useAuth"; // Import the hook

export default function Sidebar({ sidebarToggle, setSidebarToggle, isMobile }) {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigation
  const { logout } = useAuth(); // Get logout function

  const NAV_SECTIONS = [
    {
      title: "MAIN",
      links: [
        { to: "/", icon: <Home size={20} />, label: "Home" },
        { to: "/dashboard", icon: <BarChart3 size={20} />, label: "Dashboard" },
      ],
    },
    {
      title: "MANAGEMENT",
      links: [
        { to: "/campaign", icon: <Megaphone size={20} />, label: "Campaign" },
        {
          to: "/merchant-management",
          icon: <Warehouse size={20} />,
          label: "Merchant Management",
        },
        {
          to: "/approval-central",
          icon: <UserCheck size={20} />,
          label: "Approver",
        },
        {
          to: "/user-management",
          icon: <Users size={20} />,
          label: "User Management",
        },
        {
          to: "/bank-management",
          icon: <Building size={20} />,
          label: "Bank Management",
        },
        {
          to: "/bin-management",
          icon: <CreditCard size={20} />,
          label: "Segment Management",
        },
      ],
    },
    {
      title: "SETTINGS",
      links: [
        {
          to: "/settings",
          icon: <Settings size={20} />,
          label: "Configuration",
        },
      ],
    },
  ];

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleLinkClick = () => {
    if (isMobile) setSidebarToggle(false);
  };

  const handleLogout = () => {
    // Call the logout function from the hook and pass navigate
    logout(navigate);
  };

  const shouldShowSidebar = !isMobile || sidebarToggle;

  return (
    <>
      {shouldShowSidebar && (
        <aside
          className={`h-full bg-white overflow-hidden z-30 flex flex-col ${
            isMobile
              ? "fixed top-0 left-0 w-64 shadow-2xl"
              : "relative w-64 flex-shrink-0"
          }`}
          style={{
            borderRight: "1px solid #e5e7eb",
          }}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 h-16 flex items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[#0078D4] bg-white rounded-[10px] flex items-center justify-center shadow-sm">
                <img
                  src={assets.logo}
                  alt="Wyizz logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="font-[Inter] font-bold text-[20px] leading-[100%] text-[#002050]">
                  Wyizz
                </h1>
              </div>
            </div>

            {isMobile && (
              <AiOutlineClose
                className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer transition-colors ml-auto"
                onClick={() => setSidebarToggle(false)}
              />
            )}
          </div>

          {/* Navigation Content (Grow to fill space) */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-4">
              {NAV_SECTIONS.map((section, sectionIndex) => (
                <div
                  key={section.title}
                  className={sectionIndex > 0 ? "mt-6" : ""}
                >
                  <div className="px-3 py-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {section.title}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {section.links.map((link) => (
                      <div key={link.to} className="mb-1">
                        <Link
                          to={link.to}
                          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                            isActive(link.to)
                              ? "btn-purple shadow-sm"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                          onClick={handleLinkClick}
                        >
                          <div
                            className={`${
                              isActive(link.to) ? "text-white" : "text-gray-500"
                            }`}
                          >
                            {link.icon}
                          </div>
                          <span className="font-medium text-sm">
                            {link.label}
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* Footer / Logout Section */}
          <div className="p-4 border-t border-gray-200 shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium text-sm">Log Out</span>
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
