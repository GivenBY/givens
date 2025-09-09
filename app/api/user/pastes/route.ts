import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { handleApiError, AuthenticationError } from '@/lib/errors';
import { getUserPastes } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      throw new AuthenticationError('Authentication required');
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const { pastes, total } = await getUserPastes(session.user.id, page, limit);

    return NextResponse.json({
      success: true,
      pastes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: statusCode }
    );
  }
}
