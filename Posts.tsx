import HtmxSuspense from "./htmx-suspense";

export default function Posts() {
    return <HtmxSuspense fn={async () => {
        const userRes = await fetch("https://jsonplaceholder.typicode.com/users/1");
        const user = await userRes.json() as User;
        const postsRes = await fetch("https://jsonplaceholder.typicode.com/posts?userId=1");
        const posts = await postsRes.json() as Post[];
        return (
            <div className="posts">
                <h2>{user.name}</h2>
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <h3>{post.title}</h3>
                            <p>{post.body}</p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }} />
}


type Post = {
    userId: number;
    id: number;
    title: string;
    body: string;
}

type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: {
            lat: string;
            lng: string;
        };
    };
    phone: string;
    website: string;
    company: {
        name: string;
        catchPhrase: string;
        bs: string;
    };
};
