import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

import useProfile from "@/hooks/profile/useProfile";

function Profile() {
    const { userData, error } = useProfile();

    const formattedPoints = userData?.points.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    if (!userData) {
        return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-xl">{error || "กำลังโหลดข้อมูล..."}</p>
        </div>
        );
    }
  return (
    <>
        <Nav />
        <section className="min-h-screen">
            <div className="flex justify-center px-3 py-10">
                <div className="w-full max-w-2xl">

                    <div className="flex space-x-5 border border-zinc-200 p-3 rounded-3xl">
                        <div className="flex justify-center mb-2">
                            <img className="w-[100px]" src="https://cdn-icons-png.flaticon.com/512/3177/3177440.png" alt="" />
                        </div>
                        <div className="space-y-1">
                            <p className="th text-lg">
                                {userData.username}
                            </p>
                            <p>คงเหลือ {formattedPoints} บาท</p>
                            <p>สถานะ {userData.role === 1 ? "แอดมิน" : "ผู้ใช้ทั่วไป"}</p>
                            <p>เวลาสมัคร {new Date(userData.timestamp).toLocaleString('th-TH', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                second: 'numeric',
                                hour12: false
                            })}</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
        <Footer />   
    </>
  )
}

export default Profile