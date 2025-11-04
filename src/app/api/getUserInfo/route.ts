import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mysupersecretkey';

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; iat: number; exp: number };

    return NextResponse.json({ userId: payload.userId, email: payload.email });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}