import fs from 'fs';
export default function HtmxSuspense({ fn, fallback }: React.PropsWithChildren<{ fn: CallableFunction; fallback?: React.ReactNode }>) {
    const fnString = fn.toString();
    const content = `
        const jsxDEV = await import('react/jsx-dev-runtime').then((m) => m.jsxDEV);
        export default ${fnString};
    `;
    const hash = Bun.hash(fnString, 0x9e3779b9).toString(36);
    const route = `/htmx/${hash}.js`;
    const filepath = `.${route}`;
    if (!fs.existsSync(filepath)) {
        fs.writeFileSync(filepath, content);
    }
    return (
        <div
            className="htmx-suspense"
            id={`htmx-suspense-${hash}`}
            hx-trigger="load"
            hx-get={route}
            hx-swap="outerHTML"
        >
            <div className="htmx-suspense-fallback">{fallback ?? "Loading..."}</div>
        </div>
    );
}
