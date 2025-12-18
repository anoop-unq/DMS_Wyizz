// // src/context/AuthContext.jsx - FIX THIS FIRST
// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [userType, setUserType] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     const storedRole = localStorage.getItem("usertype");
//     if (storedToken && storedRole) {
//       setToken(storedToken);
//       setUserType(storedRole.toLowerCase()); // ✅ Ensure lowercase
//     }
//     setLoading(false);
//   }, []);

//   // ✅ FIX: Ensure userType is stored in lowercase
//   const loginAction = (data) => {
//     return new Promise((resolve) => {
//       // Get user type from data
//       const userType = data.usertype || data.user_type 
      
//       localStorage.setItem("token", data.access_token);
//       localStorage.setItem("uid", data.uid);
//       localStorage.setItem("usertype", userType.toLowerCase()); // ✅ Store as lowercase

//       // State Update
//       setToken(data.access_token);
//       setUserType(userType.toLowerCase()); // ✅ Set as lowercase
      
//       resolve(true);
//     });
//   };

//   const logoutAction = () => {
//     localStorage.clear();
//     setToken(null);
//     setUserType(null);
//   };

//   return (
//     <AuthContext.Provider value={{ 
//       userType, 
//       token, 
//       loginAction, 
//       logoutAction, 
//       loading 
//     }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuthContext = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api"; // ✅ Using your axios instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(null);
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null); // ✅ State to store profile data
  const [loading, setLoading] = useState(true);

  // ✅ Simplified Fetch Profile using your API utility
  const fetchProfile = async () => {
    try {
      // Your interceptor automatically adds the Bearer token
      const res = await api.get("/auth/me");
      console.log("✅ Profile API Response:", res.data); // Console check
      setProfile(res.data);
    } catch (error) {
      console.error("❌ Profile API Error:", error);
      // Note: Your api.js interceptor already handles 401 redirects
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("usertype");
    
    if (storedToken && storedRole) {
      setToken(storedToken);
      setUserType(storedRole.toLowerCase());
      fetchProfile(); // ✅ Fetch profile on refresh
    }
    setLoading(false);
  }, []);

  const loginAction = async (data) => {
    try {
      const role = data.usertype || data.user_type;
      const accessToken = data.access_token;

      // Local Storage Persistence
      localStorage.setItem("token", accessToken);
      localStorage.setItem("uid", data.uid);
      localStorage.setItem("usertype", role.toLowerCase());

      // Update State
      setToken(accessToken);
      setUserType(role.toLowerCase());

      // ✅ Fetch profile immediately after login
      // Wait for localStorage to be set so interceptor picks up the token
      await fetchProfile();

      return true;
    } catch (error) {
      console.error("Login Action Error:", error);
      return false;
    }
  };

  const logoutAction = () => {
    localStorage.clear();
    setToken(null);
    setUserType(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ 
      userType, 
      token, 
      profile, 
      loginAction, 
      logoutAction, 
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);