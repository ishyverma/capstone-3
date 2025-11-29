"use client";

import { useEffect, useState, use } from "react";
import { ProductForm } from "~/components/product-form";
import { useRouter } from "next/navigation";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct({
          ...data,
          price: String(data.price),
          stock: String(data.stock),
        });
      })
      .catch(() => {
        router.push("/admin");
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Edit Product</h1>
      <ProductForm initialData={product} isEditing />
    </div>
  );
}
