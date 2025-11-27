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

import axios from "axios";
import { useState, useEffect } from "react";

import { useVerifyToken } from "@/hooks/auth/verify";
import { useNavigate } from "react-router-dom";

interface User {
    id: string;
    username: string;
    role: number;
    points: number;
}

function UserDashboard() {
    const {isAuthenticated, isAdmin} = useVerifyToken();
    const navigate = useNavigate();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<User>>({
        username: "",
        role: 0,
        points: 0,
    });
    
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [productsPerPage] = useState<number>(5);

    if (!isAuthenticated || !isAdmin) {
        navigate('/');
    }

    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3000/admin/user", {
            withCredentials: true,
            });

            if (response.data.success) {
            setUsers(response.data.users);
            } else {
            setError(response.data.message);
            }
        } catch (err) {
            setError("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้");
        } finally {
            setLoading(false);
        }
        };

        fetchUsers();
    }, [isAuthenticated, isAdmin, navigate]);

    const handleDelete = async (id: string) => {
        try {
            const response = await axios.delete(`http://localhost:3000/admin/user/delete/${id}`, {
                withCredentials: true,
            });

            if (response.data.success) {
                setUsers(users.filter((user) => user.id !== id));
            } else {
                alert("เกิดข้อผิดพลาด: " + response.data.message);
            }
        } catch (err) {
            alert("เกิดข้อผิดพลาดในการลบผู้ใช้");
        }
    };

    const handleEdit = (user: User) => {
        setEditingUserId(user.id);
        setEditFormData({
            username: user.username,
            role: user.role,
            points: user.points,
        });
    };

    const handleCancelEdit = () => {
        setEditingUserId(null);
        setEditFormData({
            username: "",
            role: 0,
            points: 0,
        });
    };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.put(
                `http://localhost:3000/admin/user/edit/${editingUserId}`,
                editFormData,
                { withCredentials: true }
            );

            if (response.data.success) {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id === editingUserId ? { ...user, ...editFormData } : user
                    )
                );
                setEditingUserId(null);
            } else {
                alert("เกิดข้อผิดพลาด: " + response.data.message);
            }
        } catch (err) {
            alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({
            ...prev,
            [name]: name === "points" || name === "role" ? Number(value) : value,
        }));
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = users.slice(indexOfFirstProduct, indexOfLastProduct);

    const handleNext = () => {
        if (currentPage < Math.ceil(users.length / productsPerPage)) {
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
                            จัดการสมาชิก
                        </h1>
                    </div>

                    {loading ? (
                        <p>กำลังโหลดข้อมูล...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <div>
                            <Table className="border border-zinc-200">
                                <TableCaption>รายชื่อสมาชิก</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">ไอดี</TableHead>
                                        <TableHead>ชื่อผู้ใช้</TableHead>
                                        <TableHead>สถานะ</TableHead>
                                        <TableHead className="text-right">เงินคงเหลือ</TableHead>
                                        <TableHead className="text-right">จัดการ</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="text-xs">
                                    {currentProducts.map((user) => (
                                        <TableRow key={user.id}>
                                            {editingUserId === user.id ? (
                                                <>
                                                    <TableCell className="font-medium">{user.id}</TableCell>
                                                    <TableCell>
                                                        <input
                                                            type="text"
                                                            name="username"
                                                            value={editFormData.username || ""}
                                                            onChange={handleInputChange}
                                                            className="border p-1"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <select
                                                            name="role"
                                                            value={editFormData.role || ""}
                                                            onChange={handleInputChange}
                                                            className="border p-1"
                                                        >
                                                            <option value={1}>แอดมิน</option>
                                                            <option value={0}>ผู้ใช้ทั่วไป</option>
                                                        </select>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <input
                                                            type="number"
                                                            name="points"
                                                            value={editFormData.points || 0}
                                                            onChange={handleInputChange}
                                                            className="border p-1"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="flex justify-end gap-2">
                                                        <button
                                                            onClick={handleSaveEdit}
                                                            className="text-green-500 hover:underline"
                                                        >
                                                            บันทึก
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="text-gray-500 hover:underline"
                                                        >
                                                            ยกเลิก
                                                        </button>
                                                    </TableCell>
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell className="font-medium">{user.id}</TableCell>
                                                    <TableCell>{user.username}</TableCell>
                                                    <TableCell>
                                                        {user.role === 1 ? "แอดมิน" : "ผู้ใช้ทั่วไป"}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {user.points.toLocaleString(undefined, {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </TableCell>
                                                    <TableCell className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(user)}
                                                            className="text-blue-500 hover:underline"
                                                        >
                                                            แก้ไข
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="text-red-500 hover:underline"
                                                        >
                                                            ลบ
                                                        </button>
                                                    </TableCell>
                                                </>
                                            )}
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
                            หน้า {currentPage} ของ {Math.ceil(users.length / productsPerPage)}
                        </span>
                        <button
                            className="px-5 py-2 rounded-lg bg-zinc-100 text-black text-sm"
                            onClick={handleNext}
                            disabled={currentPage === Math.ceil(users.length / productsPerPage)}
                        >
                            ถัดไป
                        </button>
                    </div>

                </div>
            </div>
        </section>
        <Footer />   
    </>
  )
}

export default UserDashboard