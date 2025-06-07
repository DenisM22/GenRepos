import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';

export async function middleware(req: NextRequest) {

    const session = req.cookies.get('JSESSIONID');

    if (!session) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = '/login';
        loginUrl.searchParams.set('forbidden', 'true');

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/profile', '/family-tree/:path*', '/documents/new/:path*', '/people/new', '/people/:path*/edit']
}
