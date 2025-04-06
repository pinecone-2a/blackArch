"use client";

import AdminLayout from "@/app/_components/AdminLayout";
import ProductsMain from "@/app/_components/admin/products/ProductsMain";

export default function AdminProducts() {
    return (
        <AdminLayout>
            <ProductsMain />
        </AdminLayout>
    );
}