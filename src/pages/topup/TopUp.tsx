import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

import { Link } from "react-router-dom";

function TopUp() {
  return (
    <>
        <Nav />
        <section className="min-h-screen flex justify-center items-center">
            <div className="w-full max-w-sm">
                <h1 className="th text-xl">
                    เติมเงินและเพิ่มเครดิต
                </h1>
                <p className="text-xs text-zinc-400 -mt-1">
                    topup
                </p>
                <Link to={'/topup/code'} className="p-1 rounded-3xl border border-zinc-200 mt-5 flex items-center space-x-5 hover:scale-105 transition">
                    <div>
                        <img className="w-[100px]" src="https://cdn-icons-png.flaticon.com/512/4997/4997543.png" alt="" />
                    </div>
                    <div>
                        <h2 className="th text-lg">
                            เติมเงินด้วยโค้ด
                        </h2>
                        <p className="text-sm text-zinc-400 -mt-2">
                            เติมเงินด้วยโค้ด
                        </p>
                    </div>
                </Link>
            </div>
        </section>
        <Footer />   
    </>
  )
}

export default TopUp