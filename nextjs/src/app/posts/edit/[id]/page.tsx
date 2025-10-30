'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';
import { apiRequest } from '@/lib/api';

interface Post {
  id: number;
  title: string;
  content: string;
  thumbnail?: string;
}

export default function EditPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
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
        const res = await apiRequest<any>(`/posts/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setTitle(data.title);
        setContent(data.content);
        setPreview(data.thumbnail || null);
      } catch (err: any) {
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const token = getToken();
    if (!token) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (thumbnail) formData.append('thumbnail', thumbnail);
    formData.append('_method', 'PUT'); // Laravel form override

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${params.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to update post');
      router.push(`/posts/${params.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Edit Post</h1>
      {error && <div className="alert alert-error mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="input input-bordered w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Content"
          className="textarea textarea-bordered w-full h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {preview && (
          <img
            src={preview}
            alt="Current Thumbnail"
            className="w-full h-48 object-cover rounded-md mb-2"
          />
        )}

        <input
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setThumbnail(file);
            setPreview(file ? URL.createObjectURL(file) : preview);
          }}
        />

        <button type="submit" className="btn btn-primary w-full" disabled={saving}>
          {saving ? 'Updating...' : 'Update Post'}
        </button>
      </form>
    </div>
  );
}
