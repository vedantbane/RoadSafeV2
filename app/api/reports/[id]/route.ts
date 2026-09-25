import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getDb();
    const [report] = await sql`SELECT * FROM reports WHERE id = ${params.id}`;

    if (!report) {
      return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error('Get report by id error:', error);
    return NextResponse.json({ error: 'Unable to fetch report.' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, severity } = body;
    const sql = getDb();

    const [updated] = await sql`
      UPDATE reports
      SET status = ${status ?? 'pending'}, severity = ${severity ?? 'medium'}, updated_at = NOW()
      WHERE id = ${params.id}
      RETURNING *
    `;

    if (!updated) {
      return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update report by id error:', error);
    return NextResponse.json({ error: 'Unable to update report.' }, { status: 500 });
  }
}
