import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { IoBagCheckOutline } from "react-icons/io5";
import { Input } from "@/components/ui/input";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
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

function Store() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");

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

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.detail.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        <Nav />
        <section className="min-h-screen">
            <div className="flex justify-center px-3 py-10">
                <div className="w-full max-w-screen-xl">

                    <div className="flex justify-start mb-5 items-center">
                        <h1 className="th text-2xl">
                            สินค้าทั้งหมด
                        </h1>
                    </div>
                    <div className="flex mb-5">
                        <Input
                            className="max-w-xs"
                            type="search"
                            id="search"
                            placeholder="ค้นหาสินค้า..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>

                    {filteredProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                        
                                {filteredProducts.map((product) => (
                                    <Link
                                        to={`/product/${product.id}`}
                                        key={product.id}
                                        className="border border-zinc-200 rounded-2xl p-1"
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
                        </>
                    ) : (
                        <>
                            <p className="text-center text-sm text-zinc-300 my-10">
                                ไม่พบสินค้า
                            </p>
                        </>
                    )}

                </div>
            </div>
        </section>
        <Footer />   
    </>
  )
}

export default Store