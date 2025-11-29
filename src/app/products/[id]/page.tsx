import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { formatPrice } from "~/lib/utils";
import { AddToCartButton } from "~/components/add-to-cart-button";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <p className="mt-2 text-2xl font-bold text-primary">
              {formatPrice(Number(product.price))}
            </p>
          </div>

          <div className="prose max-w-none text-gray-600 dark:text-gray-300">
            <p>{product.description}</p>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Availability:{" "}
              <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </p>
            <AddToCartButton productId={product.id} stock={product.stock} />
          </div>
        </div>
      </div>
    </div>
  );
}
