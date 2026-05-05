'use client'
import { useState, useEffect } from 'react'
import { apiGetPosts, apiGetMyPosts, apiUpvote, apiDownvote } from '../lib/api'
import { timeAgo } from '../lib/utils'
import StatusBadge from './StatusBadge'

const CATS = ['All', 'Hostel', 'Academics', 'Mess', 'Infrastructure']

export default function FeedPage({ currentUser, feedFilter, onDetail, onToast }) {
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('votes')
  const [activeCat, setActiveCat] = useState('All')
  const [visible, setVisible] = useState(5)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [feedFilter, activeCat])

  async function loadPosts() {
    setLoading(true)
    try {
      let data
      if (feedFilter === 'my') {
        data = await apiGetMyPosts()
      } else {
        data = await apiGetPosts(activeCat !== 'All' ? activeCat : null)
      }
      setPosts(data)
    } catch (err) {
      onToast('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  async function doVote(e, postId, dir) {
    e.stopPropagation()
    if (!currentUser) { onToast('Please sign in to vote.'); return }
    try {
      const updated = dir === 'up' ? await apiUpvote(postId) : await apiDownvote(postId)
      setPosts(prev => prev.map(p => p._id === postId ? { ...p, upvotes: updated.upvotes, downvotes: updated.downvotes } : p))
    } catch (err) {
      onToast(err.message)
    }
  }

  let list = posts.filter(p => {
    const qOk = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
    return qOk
  })

  if (sort === 'votes') list.sort((a, b) => (b.upvotes.length - b.downvotes.length) - (a.upvotes.length - a.downvotes.length))
  else list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const shown = list.slice(0, visible)

  return (
    <div className="feed-page">
      <div className="feed-top">
        <div className="search-wrap">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input className="search-input" placeholder="Search posts…" value={search}
            onChange={e => { setSearch(e.target.value); setVisible(5) }} />
        </div>
        <select className="sort-select" value={sort} onChange={e => { setSort(e.target.value); setVisible(5) }}>
          <option value="votes">Sort: Top voted</option>
          <option value="newest">Sort: Newest</option>
        </select>
      </div>

      <div className="cat-filters">
        {CATS.map(c => (
          <button key={c} className={`cat-btn ${activeCat === c ? 'active' : ''}`}
            onClick={() => { setActiveCat(c); setVisible(5) }}>{c}</button>
        ))}
      </div>

      <div className="posts-list">
        {loading ? (
          <div className="empty-state"><p>Loading posts…</p></div>
        ) : shown.length === 0 ? (
          <div className="empty-state">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#D1D5DB" strokeWidth="1.5">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>{feedFilter === 'my' ? "You haven't posted anything yet." : 'No posts found.'}</p>
          </div>
        ) : shown.map(p => {
          const net = p.upvotes.length - p.downvotes.length
          return (
            <div key={p._id} className="post-card" onClick={() => onDetail(p._id)}>
              <div className="vote-col" onClick={e => e.stopPropagation()}>
                <button className="vote-btn" onClick={e => doVote(e, p._id, 'up')} title="Upvote">▲</button>
                <span className="vote-count">{net}</span>
                <button className="vote-btn" onClick={e => doVote(e, p._id, 'down')} title="Downvote">▼</button>
              </div>
              <div className="post-body">
                <div className="post-meta-top">
                  <span className="badge badge-cat">{p.category}</span>
                  <StatusBadge status={p.status} />
                </div>
                <div className="post-title">{p.title}</div>
                <div className="post-info">
                  <span>{p.isAnonymous ? 'Anonymous' : (p.author?.name || 'Unknown')}</span>
                  <span>·</span>
                  <span>{timeAgo(new Date(p.createdAt).getTime())}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {list.length > visible && (
        <div className="load-more">
          <button onClick={() => setVisible(v => v + 5)}>
            Load more ↓ ({list.length - visible} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
