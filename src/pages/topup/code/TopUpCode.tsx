import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import axios from "axios";
import { useState } from "react";

function TopUpCode() {
    const [code, setCode] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleTopUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!code) {
            setError("กรุณากรอกโค้ด");
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await axios.post(
                'http://localhost:3000/topup/code',
                { code },
                { withCredentials: true }
            );

            if (response.data.success) {
                setMessage('เติมเงินสำเร็จ! คะแนนของคุณตอนนี้: ' + response.data.points);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
            console.error(err);
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
                    <h1 className="th text-xl">
                        เติมเงินด้วยโค้ด
                    </h1>
                    <p className="text-xs text-zinc-400 -mt-1">
                        topup code
                    </p>
                </div>
                <div className="p-3 rounded-2xl border border-zinc-200 mt-5">
                    <form onSubmit={handleTopUp} className="space-y-5">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="code">โค้ดเติมเงิน</Label>
                            <Input
                                type="text"
                                id="code"
                                placeholder="โค้ดเติมเงิน"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-5 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 transition rounded-lg"
                            >
                                {loading ? 'กำลังโหลด...' : 'เติมเงิน'}
                            </button>
                        </div>
                        {error && <p className="text-sm text-blue-500 mt-2 text-center">{error}</p>}
                        {message && <p className="text-sm text-blue-500 mt-2 text-center">{message}</p>}
                    </form>
                </div>

            </div>
        </section>
        <Footer />
    </>
  )
}

export default TopUpCode