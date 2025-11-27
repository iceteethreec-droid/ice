import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import axios from "axios";
import { useState, useEffect } from "react";

import { useVerifyToken } from "@/hooks/auth/verify";
import { useNavigate } from "react-router-dom";

interface Product {
    id: string;
    name: string;
    detail: string;
    price: number;
    image_url: string;
    stock: number;
}

function ProductDashboard() {
    const {isAuthenticated, isAdmin} = useVerifyToken();
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [productsPerPage] = useState<number>(5);

    const [name, setName] = useState<string>("");
    const [detail, setDetail] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");

    if (!isAuthenticated || !isAdmin) {
        navigate('/');
    }

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:3000/product", {
                    withCredentials: true,
                });

                if (response.data.success) {
                    setProducts(response.data.products);
                } else {
                    setError(response.data.message);
                }
            } catch (err) {
                setError("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [isAuthenticated, isAdmin, navigate]);

    const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name || !detail || !price || !imageUrl) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        if (parseFloat(price) <= 0) {
            alert("ราคาต้องมากกว่า 0");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:3000/product/create",
                {
                    name,
                    detail,
                    price: parseFloat(price),
                    image_url: imageUrl
                },
                { withCredentials: true }
            );

            if (response.data.success) {
                alert("สร้างสินค้าสำเร็จ");
                setProducts((prevProducts) => [...prevProducts, response.data.product]);
                setName("");
                setDetail("");
                setPrice("");
                setImageUrl("");
            } else {
                alert("เกิดข้อผิดพลาด: " + response.data.message);
            }
        } catch (error) {
            alert("เกิดข้อผิดพลาดในการสร้างสินค้า");
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("คุณแน่ใจว่าต้องการลบสินค้านี้?")) return;
    
        try {
            const response = await axios.delete(`http://localhost:3000/product/delete/${id}`, {
                withCredentials: true,
            });
    
            if (response.data.success) {
                setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
                alert("ลบสินค้าสำเร็จ");
            } else {
                alert("เกิดข้อผิดพลาด: " + response.data.message);
            }
        } catch (error) {
            alert("เกิดข้อผิดพลาดในการลบสินค้า");
        }
    };    

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const handleNext = () => {
        if (currentPage < Math.ceil(products.length / productsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
  return (
    <>
        <Nav />
        <section className="min-h-screen">
            <div className="flex justify-center px-3 py-10">
                <div className="w-full max-w-screen-xl">

                    <div className="mb-5">
                        <h1 className="th text-xl">
                            จัดการสินค้า
                        </h1>
                    </div>
                    
                        {loading ? (
                        <p>กำลังโหลดข้อมูล...</p>
                        ) : error ? (
                        <p className="text-red-500">{error}</p>
                        ) : (
                        <div>
                            <Table>
                            <TableCaption>รายชื่อสินค้า</TableCaption>
                            <TableHeader>
                                <TableRow>
                                <TableHead>ไอดี</TableHead>
                                <TableHead>ชื่อสินค้า</TableHead>
                                <TableHead>รายละเอียด</TableHead>
                                <TableHead className="text-right">ราคา</TableHead>
                                <TableHead className="text-right">สต็อกคงเหลือ</TableHead>
                                <TableHead className="text-right">จัดการ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="text-xs">
                                {currentProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="line-clamp-1">{product.id}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.detail}</TableCell>
                                    <TableCell className="text-right">
                                    {product.price.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                    </TableCell>
                                    <TableCell className="text-right">{product.stock}</TableCell>
                                    <TableCell className="flex justify-end">
                                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500">
                                            ลบ
                                        </button>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </div>
                        )}
                        <div className="flex justify-between mt-4">
                            <button
                                className="px-5 py-2 rounded-lg bg-zinc-100 text-black text-sm"
                                onClick={handlePrev}
                                disabled={currentPage === 1}
                            >
                                ย้อนกลับ
                            </button>
                            <span className="text-xs text-center">
                                หน้า {currentPage} ของ {Math.ceil(products.length / productsPerPage)}
                            </span>
                            <button
                                className="px-5 py-2 rounded-lg bg-zinc-100 text-black text-sm"
                                onClick={handleNext}
                                disabled={currentPage === Math.ceil(products.length / productsPerPage)}
                            >
                                ถัดไป
                            </button>
                        </div>

                        <div className="mt-[100px] flex justify-center">
                            <div className="w-full max-w-sm">

                                <div>
                                    <h1 className="th text-xl">
                                        สร้างสินค้า
                                    </h1>
                                    <p className="text-xs text-zinc-400 -mt-1">
                                        create product
                                    </p>
                                </div>
                                <div className="p-3 rounded-2xl border border-zinc-200 mt-5">
                                <form className="space-y-5" onSubmit={handleCreateProduct}>
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="name">ชื่อสินค้า</Label>
                                        <Input
                                            type="text"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="ชื่อสินค้า"
                                        />
                                    </div>
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="detail">รายละเอียด</Label>
                                        <Input
                                            type="text"
                                            id="detail"
                                            value={detail}
                                            onChange={(e) => setDetail(e.target.value)}
                                            placeholder="รายละเอียด"
                                        />
                                    </div>
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="price">ราคา</Label>
                                        <Input
                                            type="number"
                                            id="price"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="ราคา"
                                        />
                                    </div>
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="image_url">ลิ้งค์รูปภาพ</Label>
                                        <Input
                                            type="text"
                                            id="image_url"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            placeholder="ลิ้งค์รูปภาพ"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-5 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 transition rounded-lg"
                                        >
                                            สร้างสินค้า
                                        </button>
                                    </div>
                                </form>
                                </div>

                            </div>
                        </div>

                </div>
            </div>
        </section>
        <Footer />   
    </>
  )
}

export default ProductDashboard