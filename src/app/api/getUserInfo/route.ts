import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '~/server/db';

const JWT_SECRET = process.env.JWT_SECRET || 'mysupersecretkey';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; iat: number; exp: number };

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ userId: user.id, ...user });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}