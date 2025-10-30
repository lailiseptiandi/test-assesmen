import { fetchPosts } from "@/lib/api";
import PostCard from "@/components/PostCard";

export default async function PostsPage() {
  const posts = await fetchPosts();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {posts.map((post: any) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
