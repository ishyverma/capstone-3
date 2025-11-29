import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { verifyAuth, unauthorized, forbidden } from '~/lib/auth';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  imageUrl: z.string().url().optional(),
  category: z.string().min(1).optional(),
  stock: z.number().int().min(0).optional(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();
  if (user.role !== 'ADMIN') return forbidden();

  const { id } = await params;

  try {
    const body = await req.json();
    const validatedData = productSchema.parse(body);

    const product = await db.product.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Product not found or internal error' }, { status: 404 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();
  if (user.role !== 'ADMIN') return forbidden();

  const { id } = await params;

  try {
    await db.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Product not found or internal error' }, { status: 404 });
  }
}
