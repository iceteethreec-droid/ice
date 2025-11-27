import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

import { Link } from "react-router-dom";

import { FiUsers } from "react-icons/fi";
import { HiOutlineArchiveBoxArrowDown } from "react-icons/hi2";
import { TfiDropbox } from "react-icons/tfi";
import { HiOutlineCode } from "react-icons/hi";

import { useVerifyToken } from "@/hooks/auth/verify";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const {isAuthenticated, isAdmin} = useVerifyToken();
    const navigate = useNavigate();

    if (!isAuthenticated || !isAdmin) {
        navigate('/');
    }
  return (
    <>
        <Nav />
        <search className="min-h-screen">
            <div className="flex justify-center px-3 py-10">
                <div className="w-full max-w-screen-xl">

                    <div>
                        <h1 className="th text-xl">
                            จัดการหลังบ้านเว็บไซต์
                        </h1>
                        <p className="text-sm -mt-2 text-zinc-500">
                            dashbaord
                        </p>
                    </div>

                    <div className="mt-10 grid grid-cols-5 gap-5">

                        <Link to={'/dashboard/user'} className="p-3 border border-zinc-200 rounded-2xl relative overflow-hidden group">
                            <h1 className="th text-lg">
                                จัดการผู้ใช้
                            </h1>
                            <p className="text-sm text-zinc-500">
                                จัดการผู้ใช้
                            </p>
                            <div className="absolute bottom-0 right-0 text-black/20 text-[60px] group-hover:text-black/40 transition group-hover:scale-105">
                                <FiUsers />
                            </div>
                        </Link>

                        <Link to={'/dashboard/product'} className="p-3 border border-zinc-200 rounded-2xl relative overflow-hidden group">
                            <h1 className="th text-lg">
                                จัดการสินค้า
                            </h1>
                            <p className="text-sm text-zinc-500">
                                จัดการสินค้า
                            </p>
                            <div className="absolute bottom-0 right-0 text-black/20 text-[60px] group-hover:text-black/40 transition group-hover:scale-105">
                                <HiOutlineArchiveBoxArrowDown />
                            </div>
                        </Link>

                        <Link to={'/dashboard/stock'} className="p-3 border border-zinc-200 rounded-2xl relative overflow-hidden group">
                            <h1 className="th text-lg">
                                จัดการสต็อกสินค้า
                            </h1>
                            <p className="text-sm text-zinc-500">
                                จัดการสต็อกสินค้า
                            </p>
                            <div className="absolute bottom-0 right-0 text-black/20 text-[60px] group-hover:text-black/40 transition group-hover:scale-105">
                                <TfiDropbox />
                            </div>
                        </Link>

                        <Link to={'/dashboard/code'} className="p-3 border border-zinc-200 rounded-2xl relative overflow-hidden group">
                            <h1 className="th text-lg">
                                จัดการโค้ดเติมเงิน
                            </h1>
                            <p className="text-sm text-zinc-500">
                                จัดการโค้ดเติมเงิน
                            </p>
                            <div className="absolute bottom-0 right-0 text-black/20 text-[60px] group-hover:text-black/40 transition group-hover:scale-105">
                                <HiOutlineCode />
                            </div>
                        </Link>

                    </div>

                </div>
            </div>
        </search>
        <Footer />   
    </>
  )
}

export default Dashboard