import { Pool } from 'pg';
import { Paste, CreatePasteRequest } from './types';
import { generateUniqueShortUrl } from './url-generator';
import { logger } from './errors';

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pool;
}

export { getPool as pool };

export async function checkShortUrlExists(shortUrl: string): Promise<boolean> {
  const client = getPool();
  try {
    const result = await client.query(
      'SELECT 1 FROM pastes WHERE short_url = $1 LIMIT 1',
      [shortUrl]
    );
    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    logger.error('Error checking short URL existence:', error);
    throw error;
  }
}

export async function createPaste(
  data: CreatePasteRequest,
  userId?: string
): Promise<Paste> {
  const client = getPool();

  try {
    const shortUrl = await generateUniqueShortUrl(checkShortUrlExists);

    const expiresAt = userId ? null : new Date(Date.now() + 24 * 60 * 60 * 1000);

    const result = await client.query(
      `INSERT INTO pastes (title, content, language, is_public, user_id, short_url, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [data.title, data.content, data.language, data.isPublic, userId || null, shortUrl, expiresAt]
    );

    const paste = result.rows[0];

    logger.info('Paste created', {
      pasteId: paste.id,
      shortUrl: paste.short_url,
      userId: userId || 'anonymous',
      expiresAt: expiresAt?.toISOString()
    });

    return {
      id: paste.id,
      title: paste.title,
      content: paste.content,
      language: paste.language,
      isPublic: paste.is_public,
      userId: paste.user_id,
      viewCount: paste.view_count,
      createdAt: new Date(paste.created_at),
      updatedAt: new Date(paste.updated_at),
      expiresAt: paste.expires_at ? new Date(paste.expires_at) : undefined,
      shortUrl: paste.short_url
    };
  } catch (error) {
    logger.error('Error creating paste:', error);
    throw error;
  }
}

export async function getPasteByShortUrl(shortUrl: string): Promise<Paste | null> {
  const client = getPool();

  try {
    const result = await client.query(
      `SELECT * FROM pastes 
       WHERE short_url = $1 
       AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)`,
      [shortUrl]
    );

    if (result.rowCount === 0) {
      return null;
    }

    const paste = result.rows[0];
    return {
      id: paste.id,
      title: paste.title,
      content: paste.content,
      language: paste.language,
      isPublic: paste.is_public,
      userId: paste.user_id,
      viewCount: paste.view_count,
      createdAt: new Date(paste.created_at),
      updatedAt: new Date(paste.updated_at),
      expiresAt: paste.expires_at ? new Date(paste.expires_at) : undefined,
      shortUrl: paste.short_url
    };
  } catch (error) {
    logger.error('Error getting paste by short URL:', error);
    throw error;
  }
}

export async function getUserPastes(
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<{ pastes: Paste[]; total: number }> {
  const client = getPool();

  try {
    const offset = (page - 1) * limit;

    const countResult = await client.query(
      'SELECT COUNT(*) FROM pastes WHERE user_id = $1',
      [userId]
    );
    const total = parseInt(countResult.rows[0].count);

    const result = await client.query(
      `SELECT * FROM pastes 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const pastes = result.rows.map(paste => ({
      id: paste.id,
      title: paste.title,
      content: paste.content,
      language: paste.language,
      isPublic: paste.is_public,
      userId: paste.user_id,
      viewCount: paste.view_count,
      createdAt: new Date(paste.created_at),
      updatedAt: new Date(paste.updated_at),
      expiresAt: paste.expires_at ? new Date(paste.expires_at) : undefined,
      shortUrl: paste.short_url
    }));

    return { pastes, total };
  } catch (error) {
    logger.error('Error getting user pastes:', error);
    throw error;
  }
}

export async function recordPasteView(
  pasteId: string,
  viewerIp?: string,
  viewerUserId?: string
): Promise<void> {
  const client = getPool();

  try {
    await client.query(
      'INSERT INTO paste_views (paste_id, viewer_ip, viewer_user_id) VALUES ($1, $2, $3)',
      [pasteId, viewerIp || null, viewerUserId || null]
    );
  } catch (error) {
    logger.error('Error recording paste view:', error);
  }
}

export async function updatePaste(
  pasteId: string,
  updates: Partial<Pick<Paste, 'title' | 'content' | 'language' | 'isPublic'>>,
  userId: string
): Promise<Paste | null> {
  const client = getPool();

  try {
    const setClauses = [];
    const values = [];
    let valueIndex = 1;

    if (updates.title !== undefined) {
      setClauses.push(`title = $${valueIndex++}`);
      values.push(updates.title);
    }
    if (updates.content !== undefined) {
      setClauses.push(`content = $${valueIndex++}`);
      values.push(updates.content);
    }
    if (updates.language !== undefined) {
      setClauses.push(`language = $${valueIndex++}`);
      values.push(updates.language);
    }
    if (updates.isPublic !== undefined) {
      setClauses.push(`is_public = $${valueIndex++}`);
      values.push(updates.isPublic);
    }

    if (setClauses.length === 0) {
      throw new Error('No updates provided');
    }

    values.push(pasteId, userId);

    const result = await client.query(
      `UPDATE pastes 
       SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${valueIndex++} AND user_id = $${valueIndex++}
       RETURNING *`,
      values
    );

    if (result.rowCount === 0) {
      return null;
    }

    const paste = result.rows[0];
    return {
      id: paste.id,
      title: paste.title,
      content: paste.content,
      language: paste.language,
      isPublic: paste.is_public,
      userId: paste.user_id,
      viewCount: paste.view_count,
      createdAt: new Date(paste.created_at),
      updatedAt: new Date(paste.updated_at),
      expiresAt: paste.expires_at ? new Date(paste.expires_at) : undefined,
      shortUrl: paste.short_url
    };
  } catch (error) {
    logger.error('Error updating paste:', error);
    throw error;
  }
}

export async function deletePaste(pasteId: string, userId: string): Promise<boolean> {
  const client = getPool();

  try {
    const result = await client.query(
      'DELETE FROM pastes WHERE id = $1 AND user_id = $2',
      [pasteId, userId]
    );

    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    logger.error('Error deleting paste:', error);
    throw error;
  }
}

export async function cleanupExpiredPastes(): Promise<number> {
  const client = getPool();

  try {
    const result = await client.query(
      'DELETE FROM pastes WHERE expires_at IS NOT NULL AND expires_at < CURRENT_TIMESTAMP'
    );

    const deletedCount = result.rowCount ?? 0;
    logger.info(`Cleaned up ${deletedCount} expired pastes`);

    return deletedCount;
  } catch (error) {
    logger.error('Error cleaning up expired pastes:', error);
    throw error;
  }
}

export async function getPublicPastes(options: {
  search?: string;
  language?: string;
  sortBy?: 'recent' | 'popular' | 'oldest';
  page?: number;
  limit?: number;
}): Promise<{ pastes: Paste[]; total: number }> {
  const client = getPool();
  const {
    search = '',
    language = '',
    sortBy = 'recent',
    page = 1,
    limit = 20
  } = options;

  try {
    const offset = (page - 1) * limit;
    let whereClause = 'WHERE is_public = true AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)';
    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      whereClause += ` AND (title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (language) {
      whereClause += ` AND language = $${paramIndex}`;
      params.push(language);
      paramIndex++;
    }

    let orderClause = 'ORDER BY created_at DESC';
    if (sortBy === 'popular') {
      orderClause = 'ORDER BY view_count DESC, created_at DESC';
    } else if (sortBy === 'oldest') {
      orderClause = 'ORDER BY created_at ASC';
    }

    const countQuery = `SELECT COUNT(*) FROM pastes ${whereClause}`;
    const countResult = await client.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    params.push(limit, offset);
    const query = `
      SELECT * FROM pastes 
      ${whereClause} 
      ${orderClause} 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const result = await client.query(query, params);

    const pastes = result.rows.map(paste => ({
      id: paste.id,
      title: paste.title,
      content: paste.content,
      language: paste.language,
      isPublic: paste.is_public,
      userId: paste.user_id,
      viewCount: paste.view_count,
      createdAt: new Date(paste.created_at),
      updatedAt: new Date(paste.updated_at),
      expiresAt: paste.expires_at ? new Date(paste.expires_at) : undefined,
      shortUrl: paste.short_url
    }));

    return { pastes, total };
  } catch (error) {
    logger.error('Error getting public pastes:', error);
    throw error;
  }
}
