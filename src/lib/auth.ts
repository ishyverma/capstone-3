import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '~/server/db';

const JWT_SECRET = process.env.JWT_SECRET || 'mysupersecretkey';

export async function verifyAuth(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1] as string;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as unknown as { userId: string; role: string };
    const user = await db.user.findUnique({
      where: { id: payload.userId },
    });
    return user;
  } catch (error) {
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function forbidden() {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
