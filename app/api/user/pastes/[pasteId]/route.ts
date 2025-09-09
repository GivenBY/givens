import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { handleApiError, AuthenticationError, ValidationError } from '@/lib/errors';
import { deletePaste } from '@/lib/database';

interface RouteParams {
  params: {
    pasteId: string;
  };
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      throw new AuthenticationError('Authentication required');
    }

    const { pasteId } = params;

    if (!pasteId) {
      throw new ValidationError('Paste ID is required');
    }

    const deleted = await deletePaste(pasteId, session.user.id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Paste not found or you do not have permission to delete it' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Paste deleted successfully'
    });

  } catch (error) {
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: statusCode }
    );
  }
}
