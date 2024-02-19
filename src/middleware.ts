import httpProxy from 'http-proxy';
import { NextRequest, NextResponse } from 'next/server';

const proxy = httpProxy.createProxyServer({
    target: 'http://95.154.93.88:32768',
    changeOrigin: true,
    secure: false,
});

export async function middleware(request: NextRequest, response: NextResponse) {
    await new Promise<void>((resolve, reject) => {
        // @ts-ignore
        proxy.web(request, response, (err: any) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};