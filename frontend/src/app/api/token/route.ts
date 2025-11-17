import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface TokenValidationResult {
  success: boolean;
  valid: boolean;
  message: string;
}

interface DecodedToken {
  exp?: number | string;
  iat?: number | string;
  [key: string]: unknown;
}

const DEFAULT_TOKEN_KEY = 'auth_token';
const FALLBACK_COOKIE_KEYS = [
  'token',
  'accessToken',
  'access_token',
  'authToken',
  'Authorization',
];

const tokenHeaderNames = ['authorization', 'Authorization', 'x-auth-token'];

const buildJsonResponse = (result: TokenValidationResult): NextResponse => {
  return NextResponse.json(result, { status: 200 });
};

const buildHeadResponse = (result: TokenValidationResult): NextResponse => {
  const headers = new Headers({
    'X-Token-Valid': String(result.valid),
    'X-Token-Success': String(result.success),
    'X-Token-Message': result.message,
  });

  return new NextResponse(null, { status: 200, headers });
};

const extractToken = (request: NextRequest): string | undefined => {
  const tokenKey = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || DEFAULT_TOKEN_KEY;
  const cookieCandidates = [tokenKey, ...FALLBACK_COOKIE_KEYS];

  for (const key of cookieCandidates) {
    const cookie = request.cookies.get(key);
    if (cookie?.value) {
      const value = cookie.value.trim();
      if (value) {
        return value;
      }
    }
  }

  for (const headerName of tokenHeaderNames) {
    const headerValue = request.headers.get(headerName);
    if (!headerValue) {
      continue;
    }

    if (headerName.toLowerCase() === 'authorization') {
      const tokenPart = headerValue.startsWith('Bearer ')
        ? headerValue.slice(7)
        : headerValue;

      const trimmed = tokenPart.trim();
      if (trimmed) {
        return trimmed;
      }

      continue;
    }

    const trimmed = headerValue.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  const queryToken = request.nextUrl.searchParams.get('token');
  if (queryToken) {
    const trimmed = queryToken.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  return undefined;
};

const parseExpiration = (value: unknown): number | null => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  }

  return null;
};

const validateToken = (token: string | undefined): TokenValidationResult => {
  if (!token) {
    return {
      success: true,
      valid: false,
      message: 'No token provided',
    };
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);

    if (!decoded || typeof decoded !== 'object') {
      return {
        success: true,
        valid: false,
        message: 'Invalid token structure',
      };
    }

    const expiration = parseExpiration(decoded.exp);

    if (expiration && expiration * 1000 <= Date.now()) {
      return {
        success: true,
        valid: false,
        message: 'Token has expired',
      };
    }

    return {
      success: true,
      valid: true,
      message: 'Token is valid',
    };
  } catch (error) {
    return {
      success: true,
      valid: false,
      message: 'Invalid token format',
    };
  }
};

const evaluateToken = (request: NextRequest): TokenValidationResult => {
  try {
    const token = extractToken(request);
    return validateToken(token);
  } catch (error) {
    return {
      success: false,
      valid: false,
      message: 'Failed to validate token',
    };
  }
};

export const dynamic = 'force-dynamic';

export function GET(request: NextRequest): NextResponse {
  const result = evaluateToken(request);
  return buildJsonResponse(result);
}

export function HEAD(request: NextRequest): NextResponse {
  const result = evaluateToken(request);
  return buildHeadResponse(result);
}
