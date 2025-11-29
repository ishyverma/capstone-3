"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useAuth } from "./auth-provider";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";

export function AddToCartButton({ productId, stock }: { productId: string; stock: number }) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please sign in to add items to cart");
      router.push("/signin");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add to cart");
      }

      toast.success("Added to cart");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      className="w-full md:w-auto"
      onClick={handleAddToCart}
      disabled={loading || stock === 0}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      {stock === 0 ? "Out of Stock" : loading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
