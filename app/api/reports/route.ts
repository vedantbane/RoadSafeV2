import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const reportSchema = z.object({
  title: z.string().trim().min(3).max(200),
  category: z.string().trim().min(2).max(80),
  description: z.string().trim().min(10).max(2000),
  severity: z.enum(['low', 'medium', 'high']).default('medium'),
  locationName: z.string().trim().min(2).max(255),
  latitude: z.number().finite().optional(),
  longitude: z.number().finite().optional(),
  reporterName: z.string().trim().max(120).optional(),
  reporterEmail: z.string().email().optional().or(z.literal('')),
  reporterPhone: z.string().trim().max(50).optional(),
  imageUrl: z.string().url().optional(),
  userId: z.string().uuid().optional(),
});

export async function GET() {
  try {
    const sql = getDb();
    const data = await sql`
      SELECT *
      FROM reports
      ORDER BY created_at DESC
    `;

    return NextResponse.json(data);
  } catch (error) {
    console.error('List reports error:', error);
    return NextResponse.json({ error: 'Unable to fetch reports.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = reportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid report payload.' }, { status: 400 });
    }

    const {
      title,
      category,
      description,
      severity,
      locationName,
      latitude,
      longitude,
      reporterName,
      reporterEmail,
      reporterPhone,
      imageUrl,
      userId,
    } = parsed.data;

    const sql = getDb();
    const [report] = await sql`
      INSERT INTO reports (
        user_id, title, category, description, severity, location_name,
        latitude, longitude, reporter_name, reporter_email, reporter_phone, image_url
      )
      VALUES (
        ${userId ?? null}, ${title}, ${category}, ${description}, ${severity}, ${locationName},
        ${latitude ?? null}, ${longitude ?? null}, ${reporterName || null},
        ${reporterEmail || null}, ${reporterPhone || null}, ${imageUrl ?? null}
      )
      RETURNING *
    `;

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Create report error:', error);
    return NextResponse.json({ error: 'Unable to create report.' }, { status: 500 });
  }
}
