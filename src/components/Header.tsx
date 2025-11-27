import { Link } from "react-router-dom";
import { useVerifyToken } from "../hooks/auth/verify";

function Header() {
    const { isAuthenticated } = useVerifyToken();
  return (
    <>
        <header className="flex justify-center px-3 pt-[50px]">
            <div className="w-full max-w-screen-xl">

                <div>
                    <h1 className="th text-center text-black text-3xl">
                        ยินดีต้อนรับ
                    </h1>
                    <div className="flex justify-center mt-2">
                        <p className="text-zinc-400 text-sm max-w-[500px] text-center">
                            ร้านของเราพร้อมจำหน่ายโค้ดเว็บไซต์สำเร็จรูป และบริการเช่าเว็บสุดคุ้ม ถูกใจสายประหยัด คุณภาพเกินราคา อยากทำเว็บแบบโปร แต่จ่ายนิดเดียว มาเลย!
                        </p>
                    </div>
                    {!isAuthenticated && (
                        <>
                            <div className="flex justify-center text-sm select-none items-center mt-5 space-x-2">
                                <Link to={'/signup'} className="bg-zinc-100 text-black px-5 py-2 rounded-lg">
                                    สมัครสมาชิก
                                </Link>
                                <Link to={'/signin'} className="bg-blue-500 text-white px-5 py-2 rounded-lg">
                                    เข้าสู่ระบบ
                                </Link>
                            </div>
                        </>
                    )}
                </div>

            </div>
        </header>   
    </>
  )
}

export default Header