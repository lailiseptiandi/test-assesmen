"use client";
import { useState } from "react";
import { API_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function PostForm({ post }: { post?: any }) {
  const [title, setTitle] = useState(post?.title || "");
  const [body, setBody] = useState(post?.body || "");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = post ? "PUT" : "POST";
    const endpoint = post ? `${API_URL}/posts/${post.id}` : `${API_URL}/posts`;

    await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });

    router.push("/posts");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="input input-bordered w-full"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="textarea textarea-bordered w-full"
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button className="btn btn-primary w-full">{post ? "Update" : "Create"}</button>
    </form>
  );
}
