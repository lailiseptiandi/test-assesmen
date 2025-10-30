'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { isAuthenticated, removeToken } from '@/lib/auth';

export default function Navbar() {
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, [pathname]);

  const handleLogout = () => {
    removeToken();
    setAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          Blog App
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link 
              href="/" 
              className={pathname === '/' ? 'active' : ''}
            >
              Posts
            </Link>
          </li>
          {authenticated ? (
            <>
              <li>
                <Link 
                  href="/posts/new" 
                  className={pathname === '/posts/new' ? 'active' : ''}
                >
                  New Post
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link 
                  href="/login" 
                  className={pathname === '/login' ? 'active' : ''}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  href="/register" 
                  className={pathname === '/register' ? 'active' : ''}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}