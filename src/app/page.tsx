import Link from "next/link";
import { db } from "~/server/db";
import { ProductCard } from "~/components/product-card";
import { Button } from "~/components/ui/button";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredProducts = await db.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-12 pb-12">

      <section className="relative flex min-h-[500px] flex-col items-center justify-center bg-black text-center text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
        <div className="relative z-10 max-w-3xl px-4">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Welcome to ShopEase
          </h1>
          <p className="mt-6 text-lg text-gray-200">
            Discover the best products at unbeatable prices. Your one-stop shop for everything you need.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              <Link href="/signup">Join Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link href="/products" className="text-primary hover:underline">
            View All &rarr;
          </Link>
        </div>
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{ ...product, price: Number(product.price) }}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">No products found. Add some from the admin panel.</p>
          </div>
        )}
      </section>
    </div>
  );
}