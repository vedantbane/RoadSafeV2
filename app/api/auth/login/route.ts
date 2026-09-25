import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { signToken } from '@/lib/auth';

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function POST(request: Request) {
  try {
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Invalid login data.' }, { status: 400 });
    const [user] = await getDb()`SELECT id, name, email, password_hash, role FROM users WHERE email = ${parsed.data.email.toLowerCase()}`;
    if (!user || !(await bcrypt.compare(parsed.data.password, user.password_hash))) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    cookies().set('roadsafe-token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Unable to log in.' }, { status: 500 });
  }
}
