import fs from 'fs';

export default function HtmxSuspense({ server, client, children }: { server: ServerFunction; client?: ClientFunction; children?: React.ReactNode }) {
    const fnString = server.toString();
    const content = `
        const jsxDEV = await import('react/jsx-dev-runtime').then((m) => m.jsxDEV);
        export default ${fnString};
    `;
    const hash = Bun.hash(fnString).toString(36);
    const route = `/generated/server/${hash}.js`;
    const filepath = `.${route}`;
    if (!fs.existsSync(filepath)) {
        fs.writeFileSync(filepath, content);
    }
    let scriptLoader = null;
    if (client) {
        const fnString = client.toString();
        const content = `(${fnString})(document);`;
        const hash = Bun.hash(fnString).toString(36);
        const route = `/generated/client/${hash}.js`;
        const filepath = `.${route}`;
        if (!fs.existsSync(filepath)) {
            fs.writeFileSync(filepath, content);
        }
        scriptLoader = `
            const script = document.createElement("script");
            script.src = "${route}";
            document.head.appendChild(script);
        `;
    }
    return (
        <>
            <div
                className="htmx-suspense"
                id={`htmx-suspense-${hash}`}
                hx-trigger="load"
                hx-get={route}
                hx-on--after-request={`${scriptLoader}`}
            >
                <div className="htmx-suspense-fallback">{children ?? "Loading..."}</div>
            </div>
        </>
    );
}

type ServerFunction = () => Promise<React.ReactNode> | React.ReactNode;
type ClientFunction = (document: Document) => void;
