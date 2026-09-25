import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const payload = verifyToken(authHeader.slice(7));
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const sql = getDb();
    const reports = await sql`SELECT * FROM reports ORDER BY created_at DESC`;
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Admin reports error:', error);
    return NextResponse.json({ error: 'Unable to fetch admin reports.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const payload = verifyToken(authHeader.slice(7));
    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const { id, status, severity } = await request.json();
    if (!id) return NextResponse.json({ error: 'Missing report id.' }, { status: 400 });
    if (status && !['pending', 'under_review', 'in_progress', 'resolved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }
    if (severity && !['low', 'medium', 'high'].includes(severity)) {
      return NextResponse.json({ error: 'Invalid severity.' }, { status: 400 });
    }

    const sql = getDb();
    const [updated] = await sql`
      UPDATE reports
      SET status = ${status ?? 'pending'}, severity = ${severity ?? 'medium'}
      WHERE id = ${id}
      RETURNING *
    `;

    if (!updated) return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update report error:', error);
    return NextResponse.json({ error: 'Unable to update report.' }, { status: 500 });
  }
}
