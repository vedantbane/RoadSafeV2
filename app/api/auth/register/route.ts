import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

const registerSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid registration data.' }, { status: 400 });
    }

    const { name, email, password } = parsed.data;
    const sql = getDb();

    const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()}`;

    if (existing.length > 0) {
      return NextResponse.json({ error: 'User already exists.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [user] = await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name ?? 'RoadSafe User'}, ${email.toLowerCase()}, ${passwordHash})
      RETURNING id, name, email, role, created_at
    `;

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Unable to create account.' }, { status: 500 });
  }
}
