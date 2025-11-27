import { useState, useEffect } from "react";
import axios from "axios";

export const useVerifyToken = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // State to track if the user is an admin
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/verify", {
          withCredentials: true,
        });

        if (response.data.success === true) {
          setIsAuthenticated(true);
          setIsAdmin(response.data.admin); // Set the admin status based on the response
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (err: any) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการตรวจสอบ token");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  return { isAuthenticated, isAdmin, loading, error };
};