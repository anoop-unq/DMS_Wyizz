import React, { useEffect, useState } from "react";
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";
import { Outlet, useLocation, useNavigate, Navigate } from "react-router-dom";

export default function HomePage() {
  const [sidebarToggle, setSidebarToggle] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  console.log("Sidebar Toggle:", sidebarToggle);
  console.log("Is Mobile:", isMobile);

  const data = localStorage.getItem("MERCHANT_DATA");
  const accessToken =
    localStorage.getItem("") || localStorage.getItem("accessToken");

  // Handle window resize to update mobile state and sidebar visibility
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // On desktop, always show sidebar. On mobile, hide it initially
      setSidebarToggle(!mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  if (!data) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex w-full h-screen bg-primary overflow-hidden">
      {/* Sidebar - Fixed position */}
      <Sidebar
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
        isMobile={isMobile}
      />

      {/* Main content area - Fixed layout */}
      <div className="flex-1 flex flex-col h-screen bg-primary">
        {/* Navbar - Fixed at top */}
        <div
          className="fixed top-0 right-0 z-40"
          style={{
            left: sidebarToggle && !isMobile ? "250px" : "0px",
            transition: "left 0.3s ease",
          }}
        >
          <Navbar setSidebarToggle={setSidebarToggle} />
        </div>

        {/* Content area - Scrollable outlet */}
        <div
          className="flex-1 overflow-y-auto mt-[90px] hide-scrollbar"
          style={{
            marginLeft: sidebarToggle && !isMobile ? "250px" : "0px",
            width: sidebarToggle && !isMobile ? "calc(100% - 250px)" : "100%",
            transition: "margin-left 0.3s ease, width 0.3s ease",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
