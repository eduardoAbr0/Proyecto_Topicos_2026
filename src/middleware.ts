import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const tieneSesion = request.cookies.has('sesion_activa');
    const rol = request.cookies.get('user_role')?.value;
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/api/admin')) {
        const esAdminRoute = pathname.startsWith('/api/admin');
        const esGetObras = pathname === '/api/admin/obras' && request.method === 'GET';

        if (!tieneSesion || (esAdminRoute && !esGetObras && rol !== 'Admin')) {
            return NextResponse.json(
                { status: "error", message: "Sesion no autorizada." },
                { status: 401 }
            );
        }
        return NextResponse.next();
    }

    if (pathname === '/login' || pathname === '/registro') {
        if (tieneSesion) {
            if (rol === 'Admin') {
                return NextResponse.redirect(new URL('/admin/miembros', request.url));
            } else if (rol === 'Cliente') {
                return NextResponse.redirect(new URL('/comprar-boletos', request.url));
            }
        }
        return NextResponse.next();
    }

    if (pathname.startsWith('/admin')) {
        if (!tieneSesion || rol !== 'Admin') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    if (pathname.startsWith('/comprar-boletos')) {
        if (!tieneSesion || rol !== 'Cliente') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    if (pathname === '/') {
        if (tieneSesion) {
            if (rol === 'Admin') {
                return NextResponse.redirect(new URL('/admin/miembros', request.url));
            } else if (rol === 'Cliente') {
                return NextResponse.redirect(new URL('/comprar-boletos', request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login', '/registro', '/admin/:path*', '/comprar-boletos', '/api/:path*'],
};