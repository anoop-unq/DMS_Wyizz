// App.jsx - Updated
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext'; 

// --- Components ---
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import ProtectedRoute from './Components/ProtectedRoute';

// --- Pages ---
import DmsLogin from './DmsLogin/DmsLogin';
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import BinManagement from './Segments/BinManagement';
import MerchantManagement from './Pages/MerchantManagement';
import Approver from './Pages/Approver'; 
import Campaign from './Pages/Campaign'; 
import UserManagement from './Pages/UserManagement';
import BankManagement from './Pages/bankManagement';

import "./App.css";
import ViewCampaign from './ViewCampaign/ViewCampagin';

// --- Layout ---
const MainLayout = ({ sidebarToggle, setSidebarToggle, isMobile }) => {
  const { userType } = useAuthContext(); // Get userType from context
  
  return (
    <div className="flex h-screen">
      {/* Pass userType to Sidebar */}
      <Sidebar 
        sidebarToggle={sidebarToggle} 
        setSidebarToggle={setSidebarToggle} 
        isMobile={isMobile}
        userType={userType} // ✅ Pass userType here
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

// --- Private Routes Wrapper ---
const PrivateRoutes = () => {
  const { token, loading } = useAuthContext();
  
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return token ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => { setIsMobile(window.innerWidth < 768); };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<DmsLogin />} />

        <Route element={<PrivateRoutes />}>
          <Route element={<MainLayout sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} isMobile={isMobile} />}>
            
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* GLOBAL VIEW */}
            <Route element={<ProtectedRoute allowedRoles={['discountmaker','discountchecker','admin','bank']} />}>
               <Route path="/view-campaign-details/:id" element={<ViewCampaign />} />
            </Route>

            {/* MAKER ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['discountmaker','discountchecker','admin','bank']} />}>
              <Route path="/campaign" element={<Campaign />} />
            </Route>



            {/* CHECKER ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['discountchecker', 'admin']} />}>
              <Route path="/approval-central" element={<Approver />} />
            </Route>

            {/* ADMIN / BANK ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['bank', 'admin']} />}>
               <Route path="/bank-management" element={<BankManagement />} />
                             <Route path="/bin-management" element={<BinManagement />} />
                                            <Route path="/merchant-management" element={<MerchantManagement />} />
               <Route path="/user-management" element={<UserManagement />} />
            </Route>

     
            
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;