"use client";

import { ProductForm } from "~/components/product-form";

export default function AddProductPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Add New Product</h1>
      <ProductForm />
    </div>
  );
}
