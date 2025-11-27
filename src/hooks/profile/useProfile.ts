import { useState, useEffect } from "react";
import axios from "axios";

interface UserData {
  username: string;
  points: number;
  role: number;
  timestamp: string;
}

const useProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3000/profile", {
          withCredentials: true,
        });

        if (response.data.success) {
          setUserData(response.data);
        } else {
          setError("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
        }
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
        console.error(err);
      }
    };

    fetchUserProfile();
  }, []);

  return { userData, error };
};

export default useProfile;