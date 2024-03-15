import { NextResponse, NextRequest } from 'next/server'
import {mainService} from "@/services/main.service";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')
    // const AdminPage = request.url === '/admin'
    // const agentData = await mainService.getAgentId()
    //
    if (token) {
        return NextResponse.next()
    }
    // if (token && agentData.admin === 1 && AdminPage) {
    //     return NextResponse.next()
    // }
    // if (token && agentData.admin === -1 && AdminPage) {
    //     return NextResponse.redirect(new URL('/', request.url))
    // }
    //
    return NextResponse.redirect(new URL('/login', request.url))

}

export const config = {
    matcher: ['//:path*', '/admin/:path*']
    // matcher: ['/admin/:path*']
}