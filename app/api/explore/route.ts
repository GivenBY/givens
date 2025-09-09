import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';

interface PasteRow {
  id: string;
  short_url: string;
  title: string;
  language: string;
  view_count: number;
  created_at: string;
  user_id: string | null;
  content: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'recent';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let orderBy = 'created_at DESC';

    switch (sort) {
      case 'popular':
        orderBy = 'view_count DESC, created_at DESC';
        break;
      case 'title':
        orderBy = 'title ASC';
        break;
      default:
        orderBy = 'created_at DESC';
    }

    const query = `
      SELECT 
        id,
        short_url,
        title,
        language,
        view_count,
        created_at,
        user_id,
        LEFT(content, 500) as content
      FROM pastes 
      WHERE is_public = true 
        AND (expires_at IS NULL OR expires_at > NOW())
      ORDER BY ${orderBy}
      LIMIT $1 OFFSET $2
    `;

    const result = await pool().query(query, [limit, offset]);

    const pastes = result.rows.map((row: PasteRow) => ({
      id: row.id,
      shortUrl: row.short_url,
      title: row.title,
      language: row.language,
      viewCount: row.view_count,
      createdAt: row.created_at,
      userId: row.user_id,
      content: row.content
    }));

    return NextResponse.json({
      success: true,
      pastes,
      total: pastes.length
    });

  } catch (error) {
    console.error('Error fetching public pastes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch public pastes' },
      { status: 500 }
    );
  }
}
