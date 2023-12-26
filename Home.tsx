import Posts from "./Posts";
export default function Home() {
    return (
        <html>
            <head>
                <title>htmx-suspense</title>
                <script src="https://unpkg.com/htmx.org@1.9.10/dist/htmx.min.js"></script>
                <link rel="stylesheet" href="/public/style.css" />
            </head>
            <body>
                <h1>htmx-suspense</h1>
                <h2>Posts</h2>
                <Posts />
            </body>
        </html>
    );
}
