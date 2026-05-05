"use client";
import { useState } from "react";
import { apiCreatePost } from "../lib/api";

export default function CreatePage({ currentUser, onBack, onToast }) {
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState("");
  const [desc, setDesc] = useState("");
  const [anon, setAnon] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!title) {
      setError("Please enter a title.");
      return;
    }
    if (!cat) {
      setError("Please select a category.");
      return;
    }
    if (!desc) {
      setError("Please write a description.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await apiCreatePost(title, desc, cat, anon);
      onToast("Post submitted successfully! ✓");
      onBack();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create-page">
      <div className="page-header">
        <h2>Create a new post</h2>
        <p>
          Your concern will be visible to all students and reviewed by the admin
          team.
        </p>
      </div>
      <div className="form-card">
        {error && <div className="error-msg">{error}</div>}
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            placeholder="Hot water not working in Block C"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">Select a category</option>
            <option>Hostel</option>
            <option>Academics</option>
            <option>Mess</option>
            <option>Infrastructure</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Describe the issue in detail…"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div className="anon-toggle">
          <label className="toggle">
            <input
              type="checkbox"
              checked={anon}
              onChange={(e) => setAnon(e.target.checked)}
            />
            <div className="toggle-track">
              <div className="toggle-thumb" />
            </div>
          </label>
          <div className="anon-label">
            Post anonymously
            <small>Your name will be hidden from other students</small>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn-secondary" onClick={onBack}>
            Cancel
          </button>
          <button
            className="btn-primary"
            style={{ flex: 2, width: "auto" }}
            onClick={submit}
            disabled={loading}
          >
            {loading ? "Submitting…" : "Submit post"}
          </button>
        </div>
      </div>
    </div>
  );
}
