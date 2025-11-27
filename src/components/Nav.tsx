import { Link, useNavigate } from "react-router-dom";
import { useVerifyToken } from "../hooks/auth/verify";
import axios from "axios";

function Nav() {
    const { isAuthenticated, isAdmin } = useVerifyToken();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await axios.get("http://localhost:3000/auth/logout", { withCredentials: true });
            navigate("/signin");
        } catch (err) {
            console.error("Error during logout", err);
        }
    };
  return (
    <>
        <nav className="flex justify-center px-3 py-4 sticky top-0 bg-white/50 backdrop-blur-2xl border-b border-b-blue-500/20 select-none z-50">
            <div className="w-full max-w-screen-xl flex justify-between items-center">
                <div className="flex items-center space-x-10">
                    <div>
                        <Link to={'/'}>
                            LOGO
                        </Link>
                    </div>
                    <div>
                        <ul className="hidden sm:flex items-center space-x-5 text-sm text-black">
                            <li>
                                <Link to={'/'} className="hover:text-blue-500 transition">
                                    หน้าหลัก
                                </Link>
                            </li>
                            <li>
                                <Link to={'/store'} className="hover:text-blue-500 transition">
                                    ร้านค้า
                                </Link>
                            </li>
                            <li>
                                <Link to={'/topup'} className="hover:text-blue-500 transition">
                                    เติมเงิน
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex items-center space-x-5">
                    {isAdmin && (
                        <>
                            <Link to={'/dashboard'} className="text-sm hover:text-blue-500 transition">
                                จัดการตั้งค่า
                            </Link>
                        </>
                    )}
                    {isAuthenticated && (
                        <>
                            <Link to={'/profile'} className="text-sm hover:text-blue-500 transition">
                                โปรไฟล์
                            </Link>
                        </>
                    )}
                    <ul className="flex items-center space-x-2 text-sm">
                        {!isAuthenticated ? (
                            <>
                            <li>
                                <Link to={'/signup'} className="bg-zinc-100 text-black px-5 py-2 rounded-lg hover:bg-zinc-200 transition">
                                    สมัครสมาชิก
                                </Link>
                            </li>
                            <li>
                                <Link to={'/signin'} className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition">
                                    เข้าสู่ระบบ
                                </Link>
                            </li>
                            </>
                        ) : (
                            <>
                                <button onClick={handleLogout} className="px-5 py-2 rounded-lg text-white bg-red-500">
                                    ออกจากระบบ
                                </button>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>   
    </>
  )
}

export default Nav