/**
 * Initializes the database and seeds it with the posts from the JSONPlaceholder API.
 */

const Sqlite = await import('bun:sqlite').then(m => m.default);
const db = Sqlite.open('./db.sqlite');
db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        title TEXT NOT NULL,
        body TEXT NOT NULL
    );
`);
const posts = await fetch("https://jsonplaceholder.typicode.com/posts").then((res) => res.json());
db.exec("BEGIN TRANSACTION");

const stmt = db.prepare("INSERT INTO posts (userId, title, body) VALUES (?, ?, ?)");
for (const post of posts) {
    stmt.run(post.userId, post.title, post.body);
}
stmt.finalize();
db.exec("COMMIT TRANSACTION");
db.close();
