import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';

// --- Pages ---

import BinManagement from './Pages/BinManagement';
import MerchantManagement from './Pages/MerchantManagement';
import Approver from './Pages/Approver';
import Campaign from './Pages/Campaign';
import UserManagement from './Pages/UserManagement';
import BankManagement from './Pages/bankManagement';
import DmsLogin from './DmsLogin/DmsLogin';
import "./App.css";
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';

// --- Layout Component ---
const MainLayout = ({ sidebarToggle, setSidebarToggle, isMobile }) => {
  return (
    <div className="flex h-screen">
      <Sidebar 
        sidebarToggle={sidebarToggle} 
        setSidebarToggle={setSidebarToggle}
        isMobile={isMobile}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar setSidebarToggle={setSidebarToggle} isMobile={isMobile} />
        <main className="flex-1 overflow-y-auto bg-[#F5F7FB] p-0">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

// --- Protected Route Component ---
const PrivateRoutes = () => {
  // Check specifically for "token" as saved in useAuth.jsx
  const isAuthenticated = localStorage.getItem("token"); 
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <Router>
      <Routes>
        {/* --- Public Route --- */}
        <Route path="/login" element={<DmsLogin />} />

        {/* --- Protected Routes --- */}
        <Route element={<PrivateRoutes />}>
          <Route element={<MainLayout sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} isMobile={isMobile} />}>
            
            {/* 1. Home Page (Root) */}
            <Route path="/" element={<Home />} />

            {/* 2. Dashboard Page */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Other Management Pages */}
                        <Route path="/campaign" element={<Campaign />} />
            <Route path="/bin-management" element={<BinManagement />} />
            <Route path="/merchant-management" element={<MerchantManagement />} />
            <Route path="/bank-management" element={<BankManagement />} />

            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/approval-central" element={<Approver />} />
            
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;