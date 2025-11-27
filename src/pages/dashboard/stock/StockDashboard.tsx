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
import { Textarea } from "@/components/ui/textarea";

import axios from "axios";
import { useState, useEffect } from "react";

import { useVerifyToken } from "@/hooks/auth/verify";
import { useNavigate } from "react-router-dom";

interface Product {
    id: string;
    name: string;
    detail: string;
    price: number;
    timestamp: string;
    image_url: string;
    stock: number;
}

interface Stock {
    id: string;
    product: {
        id: string;
        name: string;
        detail: string;
    };
    data: string;
    status: number;
    ref: string;
    timestamp: string;
}

function StockDashboard() {
    const {isAuthenticated, isAdmin} = useVerifyToken();
    const navigate = useNavigate();

    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string>("");
    const [data, setData] = useState<string>("");

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [productsPerPage] = useState<number>(5);

    if (!isAuthenticated || !isAdmin) {
        navigate('/');
    }

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = stocks.slice(indexOfFirstProduct, indexOfLastProduct);

    const handleNext = () => {
        if (currentPage < Math.ceil(stocks.length / productsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const stockResponse = await axios.get("http://localhost:3000/stock", {
                    withCredentials: true,
                });

                if (stockResponse.data.success) {
                    setStocks(stockResponse.data.stocks);
                } else {
                    setError(stockResponse.data.message);
                }

                const productResponse = await axios.get("http://localhost:3000/product", {
                    withCredentials: true,
                });

                if (productResponse.data.success) {
                    setProducts(productResponse.data.products); // บันทึกข้อมูลสินค้า
                } else {
                    setError(productResponse.data.message);
                }
            } catch (err) {
                setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
            } finally {
                setLoading(false);
            }
        };

        fetchStocks();
    }, [isAuthenticated, isAdmin, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!selectedProduct || !data) {
            setError("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }
    
        try {
            const response = await axios.post(
                "http://localhost:3000/stock/create",
                {
                    id_product: selectedProduct,
                    data: data,
                },
                {
                    withCredentials: true,
                }
            );
    
            if (response.data.success) {
                const newStock = response.data.stock;
                setStocks((prevStocks) => [...prevStocks, newStock]);
                setData("");
                setSelectedProduct("");
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError("เกิดข้อผิดพลาดในการสร้างสต็อกสินค้า");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await axios.delete(`http://localhost:3000/stock/delete/${id}`, {
                withCredentials: true,
            });
    
            if (response.data.success) {
                setStocks((prevStocks) => prevStocks.filter((stock) => stock.id !== id));
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError("เกิดข้อผิดพลาดในการลบสต็อกสินค้า");
        }
    };

    const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProduct(e.target.value);
    };

    const handleDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setData(e.target.value);
    };
  return (
    <>
        <Nav />
        <section className="min-h-screen">
            <div className="flex justify-center px-3 py-10">
                <div className="w-full max-w-screen-xl">

                    <div className="mb-5">
                        <h1 className="th text-xl">
                            จัดการสต็อกสินค้า
                        </h1>
                    </div>

                    {loading ? (
                        <p>กำลังโหลดข้อมูล...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <div>
                            <Table>
                                <TableCaption>รายการสต็อกสินค้า</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ไอดี</TableHead>
                                        <TableHead>ชื่อสินค้า</TableHead>
                                        <TableHead>รายละเอียดสินค้า</TableHead>
                                        <TableHead>สถานะ</TableHead>
                                        <TableHead>อ้างอิง</TableHead>
                                        <TableHead>เวลา</TableHead>
                                        <TableHead>จัดการ</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="text-xs">
                                    {currentProducts.map((stock) => (
                                        <TableRow key={stock.id}>
                                            <TableCell>{stock.id}</TableCell>
                                            <TableCell>{stock.product.name}</TableCell>
                                            <TableCell>{stock.product.detail}</TableCell>
                                            <TableCell>
                                                {stock.status === 1 ? (
                                                    <span className="text-green-500">ใช้งานแล้ว</span>
                                                ) : (
                                                    <span className="text-red-500">ยังไม่ได้ใช้งาน</span>
                                                )}
                                            </TableCell>
                                            <TableCell>{stock.ref || "-"}</TableCell>
                                            <TableCell>
                                                {new Date(stock.timestamp).toLocaleString("th-TH", {
                                                    dateStyle: "short",
                                                    timeStyle: "short",
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <button onClick={() => handleDelete(stock.id)} className="text-red-500">
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
                            หน้า {currentPage} ของ {Math.ceil(stocks.length / productsPerPage)}
                        </span>
                        <button
                            className="px-5 py-2 rounded-lg bg-zinc-100 text-black text-sm"
                            onClick={handleNext}
                            disabled={currentPage === Math.ceil(stocks.length / productsPerPage)}
                        >
                            ถัดไป
                        </button>
                    </div>

                    <div className="mt-[100px] flex justify-center">
                            <div className="w-full max-w-sm">

                                <div>
                                    <h1 className="th text-xl">
                                        สร้างสต็อกสินค้าสินค้า
                                    </h1>
                                    <p className="text-xs text-zinc-400 -mt-1">
                                        create stock product
                                    </p>
                                </div>
                                <div className="p-3 rounded-2xl border border-zinc-200 mt-5">
                                <form className="space-y-5" onSubmit={handleSubmit}>
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="product">สินค้า</Label>
                                        <select
                                            id="product"
                                            value={selectedProduct}
                                            onChange={handleProductChange}
                                            className="w-full p-2 border bg-white border-zinc-200 rounded-md"
                                        >
                                            <option value="">เลือกสินค้า</option>
                                            {products.map((product) => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="price">ข้อมูล</Label>
                                        <Textarea
                                        placeholder="ข้อมูล"
                                        value={data}
                                        onChange={handleDataChange}
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-5 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 transition rounded-lg"
                                        >
                                            สร้างสต็อกสินค้า
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

export default StockDashboard