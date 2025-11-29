import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { verifyAuth, unauthorized } from '~/lib/auth';

export async function GET(req: Request) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();

  const orders = await db.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();

  const cart = await db.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  let total = 0;
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Insufficient stock for product: ${item.product.name}` },
        { status: 400 }
      );
    }
    total += Number(item.product.price) * item.quantity;
  }

  try {
    const order = await db.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          total,
          status: 'COMPLETED',
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
            items: true
        }
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order creation failed:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
