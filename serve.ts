import Home from "./home";
import { renderToReadableStream } from "react-dom/server";
import fs from "fs";

// remove all files from the htmx folder
const files = fs.readdirSync('./htmx');
for (const file of files) {
    fs.unlinkSync(`./htmx/${file}`);
}

Bun.serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url);
        const pathname = url.pathname;
        if (pathname === '/') {
            const stream = await renderToReadableStream(Home());
            return new Response(stream, {
                headers: {
                    'Content-Type': 'text/html',
                },
            });
        }
        if (pathname.startsWith('/htmx')) {
            const fn: CallableFunction = await import(`.${pathname}`)
                .then(m => m.default)
                .catch((e) => () => errorMessage(e));
            const data = await fn().catch((e: any) => errorMessage(e.message));
            const stream = await renderToReadableStream(data);
            return new Response(stream, {
                headers: {
                    'Content-Type': 'text/html',
                },
            });
        }
        return new Response('Not Found', { status: 404 });
    },
});

const errorMessage = (message?: string) => `Error: ${message ?? "Unknown error"}`;

console.log("Server started at http://localhost:3000");

