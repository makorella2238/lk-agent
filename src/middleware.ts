import { createProxyMiddleware } from 'http-proxy-middleware';
import { NextRequest, NextResponse } from 'next/server';

const options = {
    target: 'http://95.154.93.88:32768',
    changeOrigin: true,
    secure: false,
};

const proxy = createProxyMiddleware(options);

export async function middleware(request: NextRequest, response: NextResponse) {
    // @ts-ignore
    await proxy(request, response);
}

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};
