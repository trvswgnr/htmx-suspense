import fs from 'fs';

export default function HtmxSuspense({ server, client, children }: { server: ServerFunction; client?: ClientFunction; children?: React.ReactNode }) {
    let serverFn = server;
    let script: () => React.ReactNode = () => null;
    let clientVars = "";
    if (client) {
        const fnString = client.toString();
        const content = `(${fnString})(document);`;
        const hash = Bun.hash(fnString).toString(36);
        const clientRoute = `/generated/client/${hash}.js`;
        const filepath = `.${clientRoute}`;
        if (!fs.existsSync(filepath)) {
            fs.writeFileSync(filepath, content);
        }
        script = () => <script src={clientRoute} />;
        serverFn = async () => {
            return (
                <>
                    {await server()}
                    {script()}
                </>
            );
        }
        clientVars = `
            const server = ${server.toString()};
            const script = ${script.toString()};
            const clientRoute = ${JSON.stringify(clientRoute)};
        `;
    }
    const fnString = serverFn.toString();
    const content = `
        const { jsxDEV, Fragment } = await import('react/jsx-dev-runtime');
        ${clientVars}
        export default ${fnString};
    `;
    const hash = Bun.hash(fnString).toString(36);
    const route = `/generated/server/${hash}.js`;
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
            {children ?? "Loading..."}
        </div>
    );
}

type ServerFunction = () => Promise<React.ReactNode> | React.ReactNode;
type ClientFunction = (document: Document) => void;
