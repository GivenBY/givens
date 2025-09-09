export const validateTitle = (title: string): boolean => {
  return title.trim().length > 0 && title.length <= 100;
};

export const validateCode = (code: string): boolean => {
  return code.length <= 100000;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateLanguage = (language: string): boolean => {
  const allowedLanguages = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'c',
    'csharp', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
    'html', 'css', 'scss', 'json', 'xml', 'yaml', 'markdown',
    'bash', 'sql', 'r', 'matlab', 'perl', 'lua', 'dart'
  ];
  return allowedLanguages.includes(language.toLowerCase());
};

export const createRateLimiter = (windowMs: number, maxRequests: number) => {
  const requests = new Map<string, number[]>();

  return (clientId: string): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!requests.has(clientId)) {
      requests.set(clientId, []);
    }

    const clientRequests = requests.get(clientId)!;
    const validRequests = clientRequests.filter(time => time > windowStart);

    if (validRequests.length >= maxRequests) {
      return false;
    }

    validRequests.push(now);
    requests.set(clientId, validRequests);

    return true;
  };
};

export const getCSP = () => {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://api.github.com https://accounts.google.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');

  return csp;
};
