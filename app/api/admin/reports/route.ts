import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
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

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const body = await request.json();
    const { id, status, severity } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing report id.' }, { status: 400 });
    }

    const sql = getDb();

    const [updated] = await sql`
      UPDATE reports
      SET status = ${status ?? 'pending'}, severity = ${severity ?? 'medium'}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!updated) {
      return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update report error:', error);
    return NextResponse.json({ error: 'Unable to update report.' }, { status: 500 });
  }
}
