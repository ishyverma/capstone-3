import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { verifyAuth, unauthorized, forbidden } from '~/lib/auth';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  imageUrl: z.string().url(),
  category: z.string().min(1).optional(),
  stock: z.number().int().min(0),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sort = searchParams.get('sort');

  const skip = (page - 1) * limit;

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (category && category !== 'all') {
    where.category = category;
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  let orderBy: any = { createdAt: 'desc' };

  if (sort === 'price-asc') {
    orderBy = { price: 'asc' };
  } else if (sort === 'price-desc') {
    orderBy = { price: 'desc' };
  } else if (sort === 'newest') {
    orderBy = { createdAt: 'desc' };
  }

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    }),
    db.product.count({ where }),
  ]);

  return NextResponse.json({
    products,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit,
    },
  });
}

export async function POST(req: Request) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();
  if (user.role !== 'ADMIN') return forbidden();

  try {
    const body = await req.json();
    const validatedData = productSchema.parse(body);

    const product = await db.product.create({
      data: validatedData,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
