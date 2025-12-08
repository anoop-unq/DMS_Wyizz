
import { useState } from "react";
import Swal from "sweetalert2";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL || "";

  const login = async (email, password) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {

      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },

        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      // 3. Handle Response
      if (!response.ok) {
        // Try to get error text/json
        const errorText = await response.text();
        throw new Error(errorText || "Login failed");
      }

      const data = await response.json();

      // 4. Validate Token Existence
      if (data && data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("uid", data.uid);
        localStorage.setItem("usertype", data.usertype);
        
        setSuccess("Login successful!");
        return { success: true, data: data };
      } else {
        throw new Error("Invalid response from server");
      }

    } catch (err) {
      console.error("Login Error:", err);
      const errorMessage = err.message || "Network error";
      setError(errorMessage);

      // SweetAlert for Error
      await Swal.fire({
        title: "Access Denied",
        text: "Invalid Credentials or Server Error",
        icon: "error",
        confirmButtonText: "Try Again",
        background: "#00201E",
        color: "#f1f5f9",
        confirmButtonColor: "#F3C27F",
      });

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };


  const logout = (navigate = null) => {
    // 1. Clear all auth data
    localStorage.removeItem("token");         // Used in previous steps
    localStorage.removeItem("uid");
    localStorage.removeItem("usertype");
    

    // 2. Redirect
    if (navigate) {
      navigate("/login", { replace: true });
    } else {
      window.location.replace("/login");
    }
  };



  return { login, logout, loading, error, success };
}