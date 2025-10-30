const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ApiResponse<T = any> {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  data: T;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  token: string;
}

export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.meta?.message || 'Something went wrong');
  }

  return response.json();
};

export const login = async (data: LoginData): Promise<ApiResponse<AuthResponse>> => {
  return apiRequest<AuthResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const register = async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
  return apiRequest<AuthResponse>('/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const logout = async (token: string): Promise<ApiResponse> => {
  return apiRequest('/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const getMe = async (token: string): Promise<ApiResponse> => {
  return apiRequest('/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};



// === Post Interfaces ===
export interface Post {
  id: number;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  thumbnail?: string;
}

// === Post API ===

// Get all posts
export const getPosts = async (token: string): Promise<ApiResponse<Post[]>> => {
  return apiRequest<Post[]>('/posts', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get single post
export const getPostById = async (token: string, id: number): Promise<ApiResponse<Post>> => {
  return apiRequest<Post>(`/posts/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Create new post
export const createPost = async (
  token: string,
  data: { title: string; content: string; thumbnail?: File }
): Promise<ApiResponse<Post>> => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('content', data.content);
  if (data.thumbnail) {
    formData.append('thumbnail', data.thumbnail);
  }

  const url = `${API_URL}/posts`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create post: ${errorText}`);
  }

  return response.json();
};


// Update existing post
export const updatePost = async (
  token: string,
  id: number,
  data: { title: string; content: string; thumbnail?: File }
): Promise<ApiResponse<Post>> => {

  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('content', data.content);
  if (data.thumbnail) {
    formData.append('thumbnail', data.thumbnail);
  }
  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error('Failed to update post');
  return res.json();
};

// Delete a post
export const deletePost = async (
  token: string,
  id: number
): Promise<ApiResponse<null>> => {
  return apiRequest<null>(`/posts/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
