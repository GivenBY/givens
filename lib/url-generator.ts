const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const SHORT_URL_LENGTH = 6;

export function generateShortUrl(): string {
  let result = '';
  for (let i = 0; i < SHORT_URL_LENGTH; i++) {
    result += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return result;
}

export function isValidShortUrl(shortUrl: string): boolean {
  const regex = new RegExp(`^[${ALPHABET}]{${SHORT_URL_LENGTH}}$`);
  return regex.test(shortUrl);
}

export async function generateUniqueShortUrl(
  checkExistence: (shortUrl: string) => Promise<boolean>
): Promise<string> {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const shortUrl = generateShortUrl();
    const exists = await checkExistence(shortUrl);

    if (!exists) {
      return shortUrl;
    }

    attempts++;
  }

  const timestamp = Date.now().toString(36);
  return timestamp.slice(-SHORT_URL_LENGTH).toUpperCase();
}

export function createPasteUrl(shortUrl: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/paste/${shortUrl}`;
}

export function extractShortUrl(url: string): string | null {
  const pasteUrlPattern = /\/paste\/([A-Za-z0-9]{6})$/;
  const match = url.match(pasteUrlPattern);
  return match ? match[1] : null;
}
