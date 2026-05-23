import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const tieneSesion = request.cookies.has('sesion_activa');
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/admin') && !tieneSesion) {
        return NextResponse.redirect(new URL('/login', request.url));
    }


    if ((pathname === '/') && tieneSesion) {
        return NextResponse.redirect(new URL('/admin/miembros', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login', '/admin/:path*'],
};