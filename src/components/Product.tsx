import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoBagCheckOutline } from "react-icons/io5";
import axios from "axios";

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
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        axios
          .get<{ success: boolean; message: string; products: Product[] }>("http://localhost:3000/product")
          .then((response) => {
            if (response.data.success) {
              setProducts(response.data.products);
            } else {
              setError(response.data.message || "เกิดข้อผิดพลาด");
            }
          })
          .catch((err) => {
            setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
            console.error(err);
          })
          .finally(() => {
            setLoading(false);
          });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <svg className="mr-3 -ml-1 size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </div>
        );
    }

    if (error) {
        return (
        <div className="flex justify-center py-[50px]">
            <p className="text-red-500">{error}</p>
        </div>
        );
    }
  return (
    <>
        <section className="flex justify-center px-3 py-[50px]">
            <div className="w-full max-w-screen-xl">

                <div className="flex justify-between mb-5 items-center">
                    <h1 className="th text-2xl">
                        สินค้าแนะนำ
                    </h1>
                    <Link to={'/store'} className="px-5 py-2 text-sm rounded-lg bg-zinc-100 text-black">
                        สินค้าทั้งหมด
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">

                    {products.slice(0, 5).map((product) => (
                        <Link
                            to={`/product/${product.id}`}
                            key={product.id}
                            className="border border-zinc-200 rounded-2xl p-1 hover:scale-95 transition duration-200 ease-in-out"
                        >
                            <div>
                            <img
                                className="w-full rounded-xl h-[200px] object-cover"
                                src={product.image_url}
                                alt={product.name}
                            />
                            </div>
                            <div className="mt-2">
                            <h1 className="line-clamp-1 th text-black text-lg">{product.name}</h1>
                            <p className="line-clamp-1 text-sm text-zinc-500">{product.detail}</p>
                            </div>
                            <div className="mt-2">
                            <h2 className="text-center">
                                <span className="pop font-bold text-transparent bg-clip-text bg-gradient-to-tr from-blue-500 to-blue-200 text-2xl">
                                {product.price.toLocaleString()}
                                </span>{" "}
                                บาท
                            </h2>
                            </div>
                            <div className="mt-2">
                            <button className="w-full text-sm py-2 rounded-xl bg-zinc-100 flex justify-center items-center gap-1">
                                <IoBagCheckOutline />
                                สั่งซื้อสินค้า
                            </button>
                            </div>
                            <p className="text-xs text-zinc-600 my-1 text-center">
                            คงเหลือ {product.stock} ชิ้น
                            </p>
                        </Link>
                    ))}

                </div>

            </div>
        </section>   
    </>
  )
}

export default Product