import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { verifyAuth, unauthorized } from '~/lib/auth';

export async function DELETE(req: Request, { params }: { params: Promise<{ itemId: string }> }) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();

  const { itemId } = await params;

  const cartItem = await db.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!cartItem || cartItem.cart.userId !== user.id) {
    return NextResponse.json({ error: 'Item not found or unauthorized' }, { status: 404 });
  }

  await db.cartItem.delete({
    where: { id: itemId },
  });

  return NextResponse.json({ message: 'Item removed from cart' });
}
