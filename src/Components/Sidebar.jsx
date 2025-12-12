// Sidebar.jsx - Updated
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  LogOut,
} from "lucide-react";
import { assets } from "../assets/assets";
import { useAuth } from "../Hook/useAuth";

export default function Sidebar({ sidebarToggle, setSidebarToggle, isMobile, userType }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // ✅ Get userType from props (passed from App.jsx)
  const currentUserType = userType ; // Default fallback
  console.log(currentUserType,"7285")
  // ✅ Define navigation sections based on userType
  const getNavSections = () => {
    return [
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
          // Campaign - show for all (as per your App.jsx routes)
          { to: "/campaign", icon: <Megaphone size={20} />, label: "Campaign" },
          
          // Merchant Management - hide from discountchecker
     
          // Approver - only for discountchecker and admin
          ...(['discountchecker', 'admin'].includes(currentUserType) ? [
            {
              to: "/approval-central",
              icon: <UserCheck size={20} />,
              label: "Approver",
            },
          ] : []),
          
          // User Management - only admin
        
          
          // Bank Management - only admin and bank
          ...(['admin', 'bank'].includes(currentUserType) ? [
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
              to: "/merchant-management",
              icon: <Warehouse size={20} />,
              label: "Merchant Management",
            },
          ] : []),
          
          // Bin Management - for makers, admin, bank
          ...([ 'admin', 'bank'].includes(currentUserType) ? [
            {
              to: "/bin-management",
              icon: <CreditCard size={20} />,
              label: "Segment Management",
            },
          ] : []),
        ],
      },
      {
        title: "SETTINGS",
        links: [
          ...(currentUserType === 'admin' ? [
            {
              to: "/settings",
              icon: <Settings size={20} />,
              label: "Configuration",
            },
          ] : []),
        ],
      },
    ].map(section => ({
      ...section,
      links: section.links.filter(link => link) // Remove any undefined/null
    })).filter(section => section.links.length > 0);
  };

  const NAV_SECTIONS = getNavSections();

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleLinkClick = () => {
    if (isMobile) setSidebarToggle(false);
  };

  const handleLogout = () => {
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
          {/* Header - Show user type */}
          <div className="p-6 border-b border-gray-200 h-16 flex items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-14 h-12 border border-[#0078D4] bg-white rounded-[10px] flex items-center justify-center shadow-sm">
                <img
                  src={assets.logo}
                  alt="Wyizz logo"
                  className="w-12.5 h-10 object-cover" 
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

          {/* Navigation Content */}
          <div className="flex-1 overflow-y-auto hide-scroll">
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