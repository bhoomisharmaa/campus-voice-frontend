'use client'
import { useState, useEffect } from 'react'
import { apiGetPost, apiUpvote, apiDownvote, apiAddComment } from '../lib/api'
import { timeAgo, avatarInitials, randColor } from '../lib/utils'
import StatusBadge from './StatusBadge'

const STATUSES = ['Pending', 'In progress', 'Resolved']

export default function DetailPage({ postId, currentUser, onBack, onToast }) {
  const [data, setData] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [anonComment, setAnonComment] = useState(false)

  useEffect(() => {
    loadPost()
  }, [postId])

  async function loadPost() {
    setLoading(true)
    try {
      const result = await apiGetPost(postId)
      setData(result)
    } catch (err) {
      onToast('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  async function doVote(dir) {
    if (!currentUser) { onToast('Please sign in to vote.'); return }
    try {
      const updated = dir === 'up' ? await apiUpvote(postId) : await apiDownvote(postId)
      setData(prev => ({ ...prev, post: { ...prev.post, upvotes: updated.upvotes, downvotes: updated.downvotes } }))
    } catch (err) {
      onToast(err.message)
    }
  }

  async function addComment() {
    const text = commentText.trim(); if (!text) return
    if (!currentUser) { onToast('Please sign in to comment.'); return }
    try {
      const comment = await apiAddComment(postId, text, anonComment)
      setData(prev => ({ ...prev, comments: [comment, ...prev.comments] }))
      setCommentText('')
      onToast('Comment posted!')
    } catch (err) {
      onToast(err.message)
    }
  }

  if (loading) return <div className="detail-page"><p style={{ padding: 24, color: 'var(--gray-400)' }}>Loading…</p></div>
  if (!data) return null

  const { post: p, comments } = data

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={onBack}>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to feed
      </button>
      <div className="detail-layout">
        <div className="detail-main">
          <div className="post-meta-top">
            <span className="badge badge-cat">{p.category}</span>
            <StatusBadge status={p.status} />
          </div>
          <div className="detail-title">{p.title}</div>
          <div className="detail-by">
            Posted {p.isAnonymous ? 'anonymously' : 'by ' + (p.author?.name || 'Unknown')} · {timeAgo(new Date(p.createdAt).getTime())}
          </div>
          <div className="detail-desc">{p.description}</div>
          <div className="vote-row">
            <button className="vote-row-btn" onClick={() => doVote('up')}>
              ▲ Upvote {p.upvotes.length}
            </button>
            <button className="vote-row-btn" onClick={() => doVote('down')}>
              ▼ Downvote {p.downvotes.length}
            </button>
          </div>

          {p.adminResponse && (
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: '12px 14px', margin: '14px 0' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#1D4ED8', marginBottom: 4 }}>ADMIN RESPONSE</div>
              <div style={{ fontSize: 13, color: '#1E3A5F' }}>{p.adminResponse}</div>
            </div>
          )}

          <div className="comments-section">
            <h3>Comments ({comments.length})</h3>
            {comments.length === 0
              ? <p style={{ fontSize: 13, color: 'var(--gray-400)', padding: '8px 0' }}>No comments yet. Be the first!</p>
              : comments.map((c, i) => (
                <div key={i} className="comment">
                  <div className="comment-avatar" style={{ background: randColor(c.author?.name || 'A') }}>
                    {avatarInitials(c.isAnonymous ? 'Anonymous' : (c.author?.name || 'A'))}
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-author">{c.isAnonymous ? 'Anonymous' : (c.author?.name || 'Unknown')}</span>
                      <span className="comment-time">{timeAgo(new Date(c.createdAt).getTime())}</span>
                    </div>
                    <div className="comment-text">{c.text}</div>
                  </div>
                </div>
              ))}
            <div className="add-comment">
              <input type="text" placeholder="Write a comment…" value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addComment()} />
              <button className="btn-post" onClick={addComment}>Post</button>
            </div>
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="sidebar-card">
            <h4>Issue Status</h4>
            <div className="status-options">
              {STATUSES.map(s => {
                const isCurrent = s === p.status
                const dotColor = s === 'Pending' ? 'var(--warn)' : s === 'In progress' ? 'var(--brand)' : 'var(--success)'
                return (
                  <div key={s} className={`status-opt ${isCurrent ? 'current-status' : ''}`}>
                    <span className="dot" style={isCurrent ? { background: dotColor } : {}} />
                    {s}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="sidebar-card">
            <h4>Stats</h4>
            <div className="stats-list">
              <div className="stat-row"><span className="stat-label">Upvotes</span><span className="stat-val">{p.upvotes.length}</span></div>
              <div className="stat-row"><span className="stat-label">Comments</span><span className="stat-val">{comments.length}</span></div>
              <div className="stat-row"><span className="stat-label">Category</span><span className="stat-val">{p.category}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
