import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { verifyAuth, unauthorized } from '~/lib/auth';
import { z } from 'zod';

const addToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1),
});

export async function GET(req: Request) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();

  const cart = await db.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!cart) {
    return NextResponse.json({ items: [] });
  }

  return NextResponse.json(cart);
}

export async function POST(req: Request) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();

  try {
    const body = await req.json();
    const { productId, quantity } = addToCartSchema.parse(body);

    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    if (product.stock < quantity) {
        return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    let cart = await db.cart.findUnique({ where: { userId: user.id } });

    if (!cart) {
      cart = await db.cart.create({
        data: { userId: user.id },
      });
    }

    const existingItem = await db.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    const updatedCart = await db.cart.findUnique({
        where: { id: cart.id },
        include: {
            items: {
                include: { product: true }
            }
        }
    });

    return NextResponse.json(updatedCart);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
