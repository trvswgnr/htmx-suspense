/// <reference types="bun-types" />

import { renderToReadableStream } from "react-dom/server";
import fs from "fs";
import Home from "./HomeComponent";

clean();
serve();

function serve() {
    const server = Bun.serve({
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
            if (pathname.startsWith('/generated/server')) {
                const fn: CallableFunction = await import(`.${pathname}`)
                    .then(m => m.default)
                    .catch((e: unknown) => () => errorMessage(e));
                const data = await fn().catch((e: unknown) => errorMessage(e));
                const stream = await renderToReadableStream(data);
                return new Response(stream, {
                    headers: {
                        'Content-Type': 'text/html',
                    },
                });
            }
            const file = Bun.file(`.${pathname}`);
            const exists = await file.exists();
            if (exists) {
                return new Response(file);
            }
            return new Response('Not Found', { status: 404 });
        },
    });

    console.log(`Server started at ${server.url}`);

    return server;
}

function clean() {
    const htmlFiles = fs.readdirSync('./generated/server');
    for (const file of htmlFiles) {
        if (file === ".gitignore") continue;
        fs.unlinkSync(`./generated/server/${file}`);
    }
    const jsFiles = fs.readdirSync('./generated/client');
    for (const file of jsFiles) {
        if (file === ".gitignore") continue;
        fs.unlinkSync(`./generated/client/${file}`);
    }
}

function errorMessage(err?: unknown) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    return `${error.name}: ${error.message}`;
}
