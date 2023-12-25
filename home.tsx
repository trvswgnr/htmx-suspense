import Posts from "./Posts";
export default function Home() {
    return (
        <html>
            <head>
                <title>htmx-suspense</title>
                <script src="https://unpkg.com/htmx.org@1.9.10"></script>
            </head>
            <body>
                <h1>htmx-suspense</h1>
                <Posts />
            </body>
        </html>
    );
}
