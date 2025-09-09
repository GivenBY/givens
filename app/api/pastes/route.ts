import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { validateCode, validateTitle, validateLanguage } from '@/lib/security';
import { handleApiError, ValidationError } from '@/lib/errors';
import { logger } from '@/lib/errors';
import { createPaste, getPasteByShortUrl, recordPasteView } from '@/lib/database';
import { CreatePasteRequest } from '@/lib/types';
import { createPasteUrl } from '@/lib/url-generator';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const body: CreatePasteRequest = await request.json();
    const { title, content, language, isPublic } = body;

    if (!validateTitle(title)) {
      throw new ValidationError('Invalid title: must be 1-100 characters');
    }

    if (!validateCode(content)) {
      throw new ValidationError('Invalid code: exceeds maximum length');
    }

    if (!validateLanguage(language)) {
      throw new ValidationError('Invalid programming language');
    }

    const paste = await createPaste(
      { title, content, language, isPublic },
      session?.user?.id
    );

    const fullUrl = createPasteUrl(paste.shortUrl, process.env.BETTER_AUTH_URL);

    logger.info('Paste created successfully', {
      pasteId: paste.id,
      shortUrl: paste.shortUrl,
      userId: session?.user?.id || 'anonymous',
      isPublic,
      expiresAt: paste.expiresAt?.toISOString()
    });

    return NextResponse.json({
      success: true,
      paste: {
        id: paste.id,
        shortUrl: paste.shortUrl,
        fullUrl,
        title: paste.title,
        language: paste.language,
        isPublic: paste.isPublic,
        expiresAt: paste.expiresAt,
        createdAt: paste.createdAt
      },
      message: session?.user?.id
        ? 'Paste saved permanently'
        : 'Paste saved for 24 hours (login to save permanently)'
    }, { status: 201 });

  } catch (error) {
    const { message, statusCode } = handleApiError(error);
    return NextResponse.json(
      { success: false, error: message },
      { status: statusCode }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shortUrl = searchParams.get('shortUrl');
    const pasteId = searchParams.get('id');

    if (!shortUrl && !pasteId) {
      throw new ValidationError('Either shortUrl or paste ID is required');
    }

    let paste;
    if (shortUrl) {
      paste = await getPasteByShortUrl(shortUrl);
    } else {
      throw new ValidationError('Getting paste by ID not implemented yet');
    }

    if (!paste) {
      return NextResponse.json(
        { success: false, error: 'Paste not found or expired' },
        { status: 404 }
      );
    }
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const canView = paste.isPublic ||
      (session?.user?.id && paste.userId === session.user.id);

    if (!canView) {
      return NextResponse.json(
        { success: false, error: 'Paste is private' },
        { status: 403 }
      );
    }

    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const viewerIp = forwarded ? forwarded.split(',')[0] : realIp || undefined;

    await recordPasteView(paste.id, viewerIp, session?.user?.id);

    return NextResponse.json({
      success: true,
      paste: {
        ...paste,
        userId: undefined
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
