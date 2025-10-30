import Link from "next/link";
import { Post } from "@/lib/api";

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="card bg-base-100 shadow-xl overflow-hidden">
      {post.thumbnail && (
        <figure>
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        </figure>
      )}

      <div className="card-body">
        <h2 className="card-title">{post.title}</h2>

        <p className="text-sm text-gray-500 mb-2">
          By {post.user?.name || "Unknown"} •{" "}
          {post.created_at
            ? new Date(post.created_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : ""}
        </p>

        <p className="line-clamp-3 text-gray-700">{post.content}</p>

        <div className="card-actions justify-end mt-4">
          <Link href={`/posts/${post.id}`} className="btn btn-sm btn-outline">
            View
          </Link>
          <Link href={`/posts/edit/${post.id}`} className="btn btn-sm btn-primary">
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}
