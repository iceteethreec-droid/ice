import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import axios from "axios";
import { useState } from "react";

import { useVerifyToken } from "@/hooks/auth/verify";
import { useNavigate } from "react-router-dom";

function CodeDashboard() {
  const {isAuthenticated, isAdmin} = useVerifyToken();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(0);

  if (!isAuthenticated || !isAdmin) {
      navigate('/');
  }

  const handleGenerateCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (points <= 0) {
      setError("กรุณากรอกจำนวนคะแนนที่ถูกต้อง");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3000/topup/generatecode",
        { points },
        { withCredentials: true }
      );

      if (response.data.success) {
        alert(`โค้ดถูกสร้างสำเร็จ: ${response.data.code}`);
      } else {
        setError(response.data.message || "เกิดข้อผิดพลาดในการสร้างโค้ด");
      }
    } catch (err: any) {
      setError("เกิดข้อผิดพลาดในการสร้างโค้ด");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
        <Nav />
        <section className="min-h-screen flex justify-center items-center">
          <section className="w-full max-w-sm">
            <div>

              <div>
                  <h1 className="th text-xl">
                      สร้างโค้ดเติมเงิน
                  </h1>
                  <p className="text-xs text-zinc-400 -mt-1">
                      gen code topup
                  </p>
              </div>
              <div className="p-3 rounded-2xl border border-zinc-200 mt-5">
                  <form className="space-y-5" onSubmit={handleGenerateCode}>
                      <div className="grid w-full items-center gap-1.5">
                          <Label htmlFor="points">จำนวนเงิน</Label>
                          <Input
                              type="text"
                              id="points"
                              placeholder="จำนวนเงิน"
                              value={points}
                            onChange={(e) => setPoints(Number(e.target.value))}
                          />
                      </div>
                      <div className="flex justify-end">
                          <button
                              type="submit"
                              className="px-5 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 transition rounded-lg"
                          >
                              {loading ? "กำลังสร้าง..." : "สร้างโค้ด"}
                          </button>
                      </div>
                      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                  </form>
              </div>

            </div>
          </section>
        </section>
        <Footer />   
    </>
  )
}

export default CodeDashboard