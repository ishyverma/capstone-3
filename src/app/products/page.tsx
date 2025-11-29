import Link from "next/link";
import { db } from "~/server/db";
import { ProductCard } from "~/components/product-card";
import { SearchInput } from "~/components/search-input";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";


export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    page?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}) {
  const { search, page, category, minPrice, maxPrice, sort } = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 12;
  const skip = (currentPage - 1) * limit;

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category && category !== "all") {
    where.category = category;
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  let orderBy: any = { createdAt: "desc" };

  if (sort === "price-asc") {
    orderBy = { price: "asc" };
  } else if (sort === "price-desc") {
    orderBy = { price: "desc" };
  } else if (sort === "newest") {
    orderBy = { createdAt: "desc" };
  }

  const [products, total, categories] = await Promise.all([
    db.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    }),
    db.product.count({ where }),
    db.product.findMany({
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  const uniqueCategories = categories.map((c) => c.category).filter(Boolean);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full space-y-6 lg:w-64">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Filters</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <div className="flex flex-col gap-2">
                  <Button
                    variant={!category || category === "all" ? "default" : "outline"}
                    className="justify-start"
                    asChild
                  >
                    <Link href={`/products?search=${search || ""}&sort=${sort || ""}`}>All</Link>
                  </Button>
                  {uniqueCategories.map((cat) => (
                    <Button
                      key={cat}
                      variant={category === cat ? "default" : "outline"}
                      className="justify-start"
                      asChild
                    >
                      <Link
                        href={`/products?category=${cat}&search=${search || ""}&sort=${sort || ""}`}
                      >
                        {cat}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="flex items-center gap-2">
                  <form className="flex gap-2">
                    {search && <input type="hidden" name="search" value={search} />}
                    {category && <input type="hidden" name="category" value={category} />}
                    {sort && <input type="hidden" name="sort" value={sort} />}
                    <Input
                      type="number"
                      placeholder="Min"
                      name="minPrice"
                      defaultValue={minPrice}
                      className="w-20"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      name="maxPrice"
                      defaultValue={maxPrice}
                      className="w-20"
                    />
                    <Button type="submit" size="sm">
                      Go
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <h1 className="text-3xl font-bold">Products</h1>
            <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
              <SearchInput />
              <div className="flex w-full flex-wrap justify-start gap-2 sm:w-auto">
                <Button variant={sort === 'newest' || !sort ? 'secondary' : 'ghost'} size="sm" asChild>
                  <Link href={`/products?sort=newest&category=${category || ''}&search=${search || ''}`}>Newest</Link>
                </Button>
                <Button variant={sort === 'price-asc' ? 'secondary' : 'ghost'} size="sm" asChild>
                  <Link href={`/products?sort=price-asc&category=${category || ''}&search=${search || ''}`}>Low to High</Link>
                </Button>
                <Button variant={sort === 'price-desc' ? 'secondary' : 'ghost'} size="sm" asChild>
                  <Link href={`/products?sort=price-desc&category=${category || ''}&search=${search || ''}`}>High to Low</Link>
                </Button>
              </div>
            </div>
          </div>

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{ ...product, price: Number(product.price) }}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage <= 1}
                    asChild={currentPage > 1}
                  >
                    {currentPage > 1 ? (
                      <Link
                        href={`/products?page=${currentPage - 1}&search=${search || ""}&category=${category || ""}&sort=${sort || ""}`}
                      >
                        Previous
                      </Link>
                    ) : (
                      <span>Previous</span>
                    )}
                  </Button>
                  <span className="flex items-center px-4 text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage >= totalPages}
                    asChild={currentPage < totalPages}
                  >
                    {currentPage < totalPages ? (
                      <Link
                        href={`/products?page=${currentPage + 1}&search=${search || ""}&category=${category || ""}&sort=${sort || ""}`}
                      >
                        Next
                      </Link>
                    ) : (
                      <span>Next</span>
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed">
              <p className="text-lg text-muted-foreground">No products found.</p>
              <Button variant="link" asChild className="mt-2">
                <Link href="/products">Clear Filters</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
