import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface Product {
    id: string;
    name: string;
    detail: string;
    price: number;
    image_url: string;
    timestamp: string;
    stock: number;
}

function Product() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [isPurchasing, setIsPurchasing] = useState<boolean>(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/product/${id}`);
                if (response.data.success) {
                    setProduct(response.data.product);
                } else {
                    setError("ไม่พบสินค้าตาม id ที่ระบุ");
                }
            } catch (err) {
                setError("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handlePurchase = async () => {
        const isConfirmed = window.confirm("คุณแน่ใจว่าต้องการสั่งซื้อสินค้านี้?");
        if (!isConfirmed) return;

        if (product) {
            setIsPurchasing(true);

            try {
                const response = await axios.post(
                    "http://localhost:3000/buy/purchase",
                    {
                        id_product: product.id,
                        quantity: 1,
                    },
                    { withCredentials: true }
                );

                if (response.data.success) {
                    alert("สั่งซื้อสำเร็จ");
                } else {
                    alert(response.data.message || "เกิดข้อผิดพลาดในการสั่งซื้อ");
                }
            } catch (error) {
                console.error(error);
                alert("เกิดข้อผิดพลาดในการสั่งซื้อสินค้า");
            } finally {
                setIsPurchasing(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl">กำลังโหลดข้อมูล...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl text-red-500">{error}</p>
            </div>
        );
    }
  return (
    <>
        <Nav />
        <section className="min-h-screen flex justify-center items-center">
            <div className="w-full max-w-sm">
                {product && (
                    <div>
                        <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded-xl" />
                        <h2 className="text-xl th mt-3">{product.name}</h2>
                        <p className="text-sm text-gray-500">{product.detail}</p>
                        <p className="text-lg mt-2 text-gray-800">ราคา <span className="pop font-bold text-transparent bg-clip-text bg-gradient-to-tr from-blue-500 to-blue-200">{product.price}</span> บาท</p>
                        <p className="text-sm mt-1 text-gray-500">จำนวนคงเหลือ {product.stock} ชิ้น</p>
                        <div className="mt-5 flex justify-center">
                            {product.stock <= 0 ? (
                                <>
                                    <p className="text-center text-sm text-red-500">
                                        สินค้าหมดชั่วคราว
                                    </p>
                                </>
                            ) : (
                                <>
                                    <button disabled={isPurchasing} onClick={handlePurchase} className="px-5 py-2 rounded-lg bg-blue-500 text-sm text-white">
                                        {isPurchasing ? "กำลังสั่งซื้อ..." : "สั่งซื้อสินค้า"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
        <Footer />   
    </>
  )
}

export default Product