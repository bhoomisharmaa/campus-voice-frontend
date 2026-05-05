const BASE = process.env.NEXT_PUBLIC_API_URL;

function getToken() {
  try {
    return JSON.parse(localStorage.getItem("cv_token") || "null");
  } catch {
    return null;
  }
}

function authHeaders() {
  const token = getToken();
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

// ── AUTH ─────────────────────────────────────────────────────────────────────
export async function apiRegister(name, email, password) {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
}

export async function apiLogin(email, password) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  // save token
  localStorage.setItem("cv_token", JSON.stringify(data.token));
  return data;
}

export function apiLogout() {
  localStorage.removeItem("cv_token");
  localStorage.removeItem("cv_session");
}

// ── POSTS ────────────────────────────────────────────────────────────────────
export async function apiGetPosts(category, status) {
  let url = `${BASE}/api/posts`;
  const params = [];
  if (category && category !== "All") params.push(`category=${category}`);
  if (status && status !== "all") params.push(`status=${status}`);
  if (params.length) url += "?" + params.join("&");
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch posts");
  return data;
}

export async function apiGetPost(id) {
  const res = await fetch(`${BASE}/api/posts/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch post");
  return data;
}

export async function apiGetMyPosts() {
  const res = await fetch(`${BASE}/api/posts/my/posts`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch your posts");
  return data;
}

export async function apiCreatePost(title, description, category, isAnonymous) {
  const res = await fetch(`${BASE}/api/posts`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ title, description, category, isAnonymous }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create post");
  return data;
}

export async function apiUpvote(id) {
  const res = await fetch(`${BASE}/api/posts/${id}/upvote`, {
    method: "PUT",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to upvote");
  return data;
}

export async function apiDownvote(id) {
  const res = await fetch(`${BASE}/api/posts/${id}/downvote`, {
    method: "PUT",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to downvote");
  return data;
}

export async function apiAddComment(postId, text, isAnonymous) {
  const res = await fetch(`${BASE}/api/posts/${postId}/comments`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ text, isAnonymous }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add comment");
  return data;
}

export async function apiDeletePost(id) {
  const res = await fetch(`${BASE}/api/posts/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete post");
  return data;
}

// ── ADMIN ────────────────────────────────────────────────────────────────────
export async function apiAdminGetPosts() {
  const res = await fetch(`${BASE}/api/admin/posts`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch admin posts");
  return data;
}

export async function apiAdminUpdatePost(id, status, adminResponse) {
  const res = await fetch(`${BASE}/api/admin/posts/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ status, adminResponse }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update post");
  return data;
}
