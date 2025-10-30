'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getToken, isAuthenticated } from '@/lib/auth';
import { apiRequest } from '@/lib/api';

interface Post {
  id: number;
  title: string;
  content: string;
  thumbnail?: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
  };
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    fetchPosts(1);
  }, []);

  const fetchPosts = async (pageNum = 1) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await apiRequest<any>(`/posts?page=${pageNum}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const pagination = response.data;
      setPosts(pagination.data);
      setPage(pagination.current_page);
      setLastPage(pagination.last_page);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        {authenticated && (
          <Link href="/post/new" className="btn btn-primary">
            Create New Post
          </Link>
        )}
      </div>

      {/* Jika tidak ada post */}
      {posts.length === 0 ? (
        <div className="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div>
            <h3 className="font-bold">No posts yet!</h3>
            <div className="text-xs">Be the first to create a post.</div>
          </div>
        </div>
      ) : (
        <>
          {/* List Post */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="card bg-base-100 shadow-xl overflow-hidden">
                {/* Thumbnail */}
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
                  <h2 className="card-title line-clamp-2">{post.title}</h2>

                  {/* Author + Date */}
                  <p className="text-sm text-gray-500">
                    By {post.user?.name || 'Unknown'} •{' '}
                    {new Date(post.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>

                  <p className="text-gray-700 line-clamp-3">{post.content}</p>

                  <div className="card-actions justify-between mt-4">
                    <Link href={`/posts/${post.id}`} className="btn btn-sm btn-primary">
                      Read More
                    </Link>

                    <Link href={`/posts/edit/${post.id}`} className="btn btn-sm btn-outline">
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 gap-4">
            <button
              className="btn btn-outline"
              onClick={() => fetchPosts(page - 1)}
              disabled={page <= 1}
            >
              « Previous
            </button>

            <span className="px-4 py-2 font-medium">
              Page {page} of {lastPage}
            </span>

            <button
              className="btn btn-outline"
              onClick={() => fetchPosts(page + 1)}
              disabled={page >= lastPage}
            >
              Next »
            </button>
          </div>
        </>
      )}
    </div>
  );
}
