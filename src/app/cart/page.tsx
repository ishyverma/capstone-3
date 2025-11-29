"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "~/components/auth-provider";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { formatPrice } from "~/lib/utils";
import { Trash2, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: string;
    imageUrl: string;
  };
}

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin");
      return;
    }

    if (user) {
      fetchCart();
    }
  }, [user, authLoading, router]);

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
        toast.success("Item removed");
      }
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
      toast.info("Update quantity not implemented in this demo. Remove and add again.");
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      if (res.ok) {
        toast.success("Order placed successfully!");
        setCartItems([]);
        router.push("/profile");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to place order");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (authLoading || loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const total = cartItems.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

      {cartItems.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="flex flex-row items-center gap-4 p-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-gray-100">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(Number(item.product.price))}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Qty: {item.quantity}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                >
                  {checkoutLoading ? "Processing..." : "Checkout"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed">
          <p className="text-lg text-muted-foreground">Your cart is empty.</p>
          <Button asChild className="mt-4">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
