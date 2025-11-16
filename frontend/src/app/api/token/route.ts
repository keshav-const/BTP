import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { AUTH_COOKIE_NAME } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token found', valid: false },
        { status: 401 }
      );
    }

    // Validate token by decoding it and checking expiration
    try {
      const decoded = jwtDecode<{ exp?: number }>(token);
      const isExpired = decoded.exp ? decoded.exp * 1000 < Date.now() : true;

      if (isExpired) {
        return NextResponse.json(
          { success: false, message: 'Token expired', valid: false },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { success: true, valid: true },
        { status: 200 }
      );
    } catch (decodeError) {
      return NextResponse.json(
        { success: false, message: 'Invalid token format', valid: false },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Token validation failed', valid: false },
      { status: 500 }
    );
  }
}
