import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

const updateSchema = z.object({
  status: z.enum(['pending', 'under_review', 'in_progress', 'resolved', 'rejected']).optional(),
  severity: z.enum(['low', 'medium', 'high']).optional(),
});

function requireAdmin(request: Request) {
  const bearer = request.headers.get('authorization');
  const cookieToken = cookies().get('roadsafe-token')?.value;
  const token = bearer?.startsWith('Bearer ') ? bearer.slice(7) : cookieToken;
  if (!token) throw new Error('UNAUTHORIZED');
  const payload = verifyToken(token);
  if (payload.role !== 'admin') throw new Error('FORBIDDEN');
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const sql = getDb();
    const [report] = await sql`SELECT * FROM reports WHERE id = ${params.id}`;
    if (!report) return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
    return NextResponse.json(report);
  } catch (error) {
    console.error('Get report error:', error);
    return NextResponse.json({ error: 'Unable to fetch report.' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    requireAdmin(request);
    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success || (!parsed.data.status && !parsed.data.severity)) {
      return NextResponse.json({ error: 'Provide a valid status or severity.' }, { status: 400 });
    }
    const sql = getDb();
    const [updated] = await sql`
      UPDATE reports
      SET status = COALESCE(${parsed.data.status ?? null}, status),
          severity = COALESCE(${parsed.data.severity ?? null}, severity),
          updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `;
    if (!updated) return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    if (message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    console.error('Update report error:', error);
    return NextResponse.json({ error: 'Unable to update report.' }, { status: 500 });
  }
}
