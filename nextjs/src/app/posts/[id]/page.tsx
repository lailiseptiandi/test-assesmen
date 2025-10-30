'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';
import { apiRequest, deletePost } from '@/lib/api';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  content: string;
  thumbnail?: string;
  created_at: string;
  user?: { id: number; name: string };
}

export default function PostDetailPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await apiRequest<{ data: Post }>(`/posts/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPost(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id, router]);

  const handleDelete = async () => {
    const token = getToken();
    if (!token) return;

    const confirmed = confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deletePost(token, Number(params.id));
      router.push('/'); // kembali ke list
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to delete post.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-error max-w-xl mx-auto">
        <span>{error}</span>
      </div>
    );

  if (!post) return null;

  return (
    <div className="max-w-3xl mx-auto">
      {post.thumbnail && (
        <img
          src={post.thumbnail}
          alt={post.title}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      )}

      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 mb-6">
        By {post.user?.name || 'Unknown'} •{' '}
        {new Date(post.created_at).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </p>

      <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-line mb-10">
        {post.content}
      </p>

      <div className="flex justify-between">
        <Link href="/" className="btn btn-outline">
          ← Back
        </Link>

        <div className="flex gap-2">
          <Link href={`/posts/edit/${post.id}`} className="btn btn-outline">
            Edit
          </Link>

          <button
            onClick={handleDelete}
            className="btn btn-error"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
