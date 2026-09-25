import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function requireAdmin(request: Request) {
  const bearer = request.headers.get('authorization');
  const token = bearer?.startsWith('Bearer ') ? bearer.slice(7) : cookies().get('roadsafe-token')?.value;
  if (!token) throw new Error('UNAUTHORIZED');
  const payload = verifyToken(token);
  if (payload.role !== 'admin') throw new Error('FORBIDDEN');
}

export async function GET(request: Request) {
  try {
    requireAdmin(request);
    const reports = await getDb()`SELECT * FROM reports ORDER BY created_at DESC`;
    return NextResponse.json(reports);
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    console.error('Admin reports error:', error);
    return NextResponse.json({ error: 'Unable to fetch reports' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    requireAdmin(request);
    const { id, status, severity } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing report id' }, { status: 400 });
    const [updated] = await getDb()`
      UPDATE reports
      SET status = COALESCE(${status ?? null}, status), severity = COALESCE(${severity ?? null}, severity), updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (!updated) return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    console.error('Admin patch error:', error);
    return NextResponse.json({ error: 'Unable to update report' }, { status: 500 });
  }
}
