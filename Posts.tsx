/// <reference lib="dom" />

import HtmxSuspense from "./HtmxSuspense";
import { type z } from "zod";

export default function Posts() {
    return (
        <HtmxSuspense
            server={serverAction}
            client={clientAction}
        >
            <div className="htmx-suspense-fallback">Loading...</div>
        </HtmxSuspense>
    );
}

const serverAction = async () => {
    console.log("hello from server");
    const { Database } = await import("bun:sqlite");
    const { z } = await import("zod");
    const db = Database.open("db.sqlite");
    const Post = z.object({
        userId: z.number(),
        id: z.number(),
        title: z.string(),
        body: z.string(),
    });
    type Post = z.infer<typeof Post>;
    const rows = db.prepare("SELECT * FROM posts").all().map((row) => Post.parse(row));
    return <div className="posts">
        {rows.map((post) => <div className="post" key={post.id}>
            <h2 className="post-title">{post.title}</h2>
            <p className="post-body">{post.body}</p>
        </div>)}
    </div>;
};

const clientAction = (document: Document) => {
    console.log("hello from client");
    const posts = document.querySelector(".posts");
    if (posts) {
        posts.classList.add("loaded");
    }
}
