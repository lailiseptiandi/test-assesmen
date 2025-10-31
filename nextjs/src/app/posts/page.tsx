import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth";
import { getPosts } from "@/lib/api";
import PostCard from "@/components/PostCard";

export default async function PostsPage() {
  const token = getToken();
  if (!token) {
    redirect("/login"); 
  }

  const posts = await getPosts(token);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {posts.data.map((post: any) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
