// src/hooks/useAuth.js
import { useState } from "react";
import Swal from "sweetalert2";
import { useAuthContext } from "../context/AuthContext"; 

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const { loginAction, logoutAction } = useAuthContext();
  const apiUrl = import.meta.env.VITE_API_URL || "";

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password: password }),
      });

      if (!response.ok) throw new Error("Login failed");
      const data = await response.json();

      if (data && data.access_token) {
        // ✅ FIX: Wait for Context to update before returning
        await loginAction(data); 
        return { success: true, data: data };
      } else {
        throw new Error("Invalid response");
      }

    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = (navigate) => {
    logoutAction();
    if (navigate) navigate("/login", { replace: true });
  };

  return { login, logout, loading };
}