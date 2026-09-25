import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
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

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const body = await request.json();
    const status = body.status;
    const severity = body.severity;

    if (status !== undefined && !['pending', 'under_review', 'in_progress', 'resolved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }
    if (severity !== undefined && !['low', 'medium', 'high'].includes(severity)) {
      return NextResponse.json({ error: 'Invalid severity.' }, { status: 400 });
    }

    const sql = getDb();
    const [updated] = await sql`
      UPDATE reports
      SET status = ${status ?? 'pending'}, severity = ${severity ?? 'medium'}
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
