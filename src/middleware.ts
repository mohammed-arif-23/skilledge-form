import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('admin_session');

    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    if (request.nextUrl.pathname === '/login' && token) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
