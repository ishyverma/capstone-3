import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { formatPrice } from "~/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  imageUrl: string;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1 text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-0">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4">
        <span className="text-lg font-bold">
          {formatPrice(Number(product.price))}
        </span>
        <Button asChild size="sm">
          <Link href={`/products/${product.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
