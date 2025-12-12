// src/context/AuthContext.jsx - FIX THIS FIRST
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("usertype");
    if (storedToken && storedRole) {
      setToken(storedToken);
      setUserType(storedRole.toLowerCase()); // ✅ Ensure lowercase
    }
    setLoading(false);
  }, []);

  // ✅ FIX: Ensure userType is stored in lowercase
  const loginAction = (data) => {
    return new Promise((resolve) => {
      // Get user type from data
      const userType = data.usertype || data.user_type 
      
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("uid", data.uid);
      localStorage.setItem("usertype", userType.toLowerCase()); // ✅ Store as lowercase

      // State Update
      setToken(data.access_token);
      setUserType(userType.toLowerCase()); // ✅ Set as lowercase
      
      resolve(true);
    });
  };

  const logoutAction = () => {
    localStorage.clear();
    setToken(null);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ 
      userType, 
      token, 
      loginAction, 
      logoutAction, 
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);