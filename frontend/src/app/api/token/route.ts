import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { AUTH_COOKIE_NAME } from '@/lib/auth';

const createResponse = (data: any) => {
  const response = NextResponse.json(data, { status: 200 });
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  return response;
};

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return createResponse({
        success: false,
        message: 'No token found',
        valid: false,
      });
    }

    try {
      const decoded = jwtDecode<{ exp?: number }>(token);
      const isExpired = decoded.exp ? decoded.exp * 1000 < Date.now() : true;

      if (isExpired) {
        return createResponse({
          success: false,
          message: 'Token expired',
          valid: false,
        });
      }

      return createResponse({
        success: true,
        valid: true,
      });
    } catch (decodeError) {
      return createResponse({
        success: false,
        message: 'Invalid token format',
        valid: false,
      });
    }
  } catch (error) {
    return createResponse({
      success: false,
      message: 'Token validation failed',
      valid: false,
    });
  }
}

export async function HEAD(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  return response;
}
