import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

function SignUp() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.get("http://localhost:3000/auth/verify", {
                    withCredentials: true,
                });

                if (response.data.success === true) {
                    navigate("/");
                }
            } catch (err: any) {
                setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการตรวจสอบ token");
            }
        };

        verifyToken();
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:3000/auth/register",
                { username, password },
                { withCredentials: true }
            );

            if (response.data.success) {
                navigate("/");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
        } finally {
            setLoading(false);
        }
    };
  return (
    <>
        <Nav />
        <section className="min-h-screen flex justify-center items-center">
            <div className="w-full max-w-sm">

                <div>
                    <h1 className="th text-2xl text-blue-500 text-start">
                        สมัครสมาชิก
                    </h1>
                    <p className="text-xs text-zinc-400 -mt-1">
                        signup
                    </p>
                </div>
                <div className="p-3 rounded-2xl border border-zinc-200 mt-5">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="username">ชื่อผู้ใช้</Label>
                            <Input
                                type="text"
                                id="username"
                                placeholder="ชื่อผู้ใช้"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="password">รหัสผ่าน</Label>
                            <Input
                                type="password"
                                id="password"
                                placeholder="รหัสผ่าน"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-5 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 transition rounded-lg"
                                disabled={loading}
                            >
                                {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
                            </button>
                        </div>
                    </form>
                </div>
                {error && (
                    <p className="text-xs text-red-500 text-center mt-3">{error}</p>
                )}
                <p className="text-xs text-center mt-5">
                    มีบัญชีแล้ว? <Link to={'/signin'} className="text-blue-500">เข้าสู่ระบบ</Link>
                </p>

            </div>
        </section>
        <Footer /> 
    </>
  )
}

export default SignUp