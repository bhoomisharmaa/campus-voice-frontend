'use client'
import { useState, useEffect } from 'react'
import { apiAdminGetPosts, apiAdminUpdatePost } from '../lib/api'
import StatusBadge from './StatusBadge'

const NAV = [
  { label: 'Overview', f: 'all', icon: true },
  { label: 'All posts', f: 'all' },
  { label: 'Pending', f: 'Pending' },
  { label: 'In progress', f: 'In progress' },
  { label: 'Resolved', f: 'Resolved' },
]

export default function AdminPage({ onDetail, onToast }) {
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState('all')
  const [activeNav, setActiveNav] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalPostId, setModalPostId] = useState(null)
  const [modalStatus, setModalStatus] = useState('Pending')
  const [modalResponse, setModalResponse] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadPosts() }, [])

  async function loadPosts() {
    setLoading(true)
    try {
      const data = await apiAdminGetPosts()
      setPosts(data)
    } catch (err) {
      onToast('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const total = posts.length
  const pending = posts.filter(p => p.status === 'Pending').length
  const inprog = posts.filter(p => p.status === 'In progress').length
  const resolved = posts.filter(p => p.status === 'Resolved').length

  let list = filter === 'all' ? posts : posts.filter(p => p.status === filter)
  list = [...list].sort((a, b) => (b.upvotes.length - b.downvotes.length) - (a.upvotes.length - a.downvotes.length))

  function openModal(postId) {
    const p = posts.find(x => x._id === postId)
    setModalPostId(postId)
    setModalStatus(p?.status || 'Pending')
    setModalResponse(p?.adminResponse || '')
    setModalOpen(true)
  }

  async function applyStatus() {
    try {
      const updated = await apiAdminUpdatePost(modalPostId, modalStatus, modalResponse)
      setPosts(prev => prev.map(p => p._id === modalPostId ? updated : p))
      setModalOpen(false)
      onToast(`Status updated to "${modalStatus}"`)
    } catch (err) {
      onToast(err.message)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        {NAV.map((item, i) => (
          <div key={i}
            className={`admin-nav-item ${activeNav === i ? 'active' : ''}`}
            onClick={() => { setFilter(item.f); setActiveNav(i) }}>
            {item.icon && (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
              </svg>
            )}
            {item.label}
          </div>
        ))}
      </div>

      <div className="admin-content">
        <div className="stats-grid">
          <div className="stat-card"><div className="num">{total}</div><div className="label">Total posts</div></div>
          <div className="stat-card"><div className="num">{pending}</div><div className="label">Pending</div></div>
          <div className="stat-card"><div className="num">{inprog}</div><div className="label">In progress</div></div>
          <div className="stat-card"><div className="num">{resolved}</div><div className="label">Resolved</div></div>
        </div>

        <div className="admin-table-card">
          <div className="admin-table-header"><h3>Recent posts — sorted by votes</h3></div>
          <div style={{ overflowX: 'auto' }}>
            {loading ? (
              <p style={{ padding: 24, color: 'var(--gray-400)', textAlign: 'center' }}>Loading…</p>
            ) : (
              <table>
                <thead>
                  <tr><th>Issue</th><th>Category</th><th>Votes</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {list.length === 0
                    ? <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--gray-400)', padding: 24 }}>No posts found</td></tr>
                    : list.map(p => (
                      <tr key={p._id}>
                        <td style={{ maxWidth: 260, whiteSpace: 'normal' }}>{p.title}</td>
                        <td>{p.category}</td>
                        <td>{p.upvotes.length - p.downvotes.length}</td>
                        <td><StatusBadge status={p.status} /></td>
                        <td>
                          {p.status !== 'Resolved'
                            ? <button className="btn-table" onClick={() => openModal(p._id)}>Update</button>
                            : <button className="btn-table" onClick={() => onDetail(p._id)}>View</button>}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <div className={`modal-overlay ${modalOpen ? 'open' : ''}`}
        onClick={e => { if (e.target.classList.contains('modal-overlay')) setModalOpen(false) }}>
        <div className="modal">
          <h3>Update Status</h3>
          <p>Change the status of this issue:</p>
          <select value={modalStatus} onChange={e => setModalStatus(e.target.value)}>
            <option value="Pending">Pending</option>
            <option value="In progress">In progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <div className="form-group" style={{ marginTop: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>Admin response (optional)</label>
            <textarea
              style={{ width: '100%', padding: '8px', borderRadius: 6, border: '1px solid #E5E7EB', fontSize: 13, marginTop: 4, minHeight: 70 }}
              placeholder="Write a response to the student…"
              value={modalResponse}
              onChange={e => setModalResponse(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn-primary" style={{ width: 'auto', flex: 2 }} onClick={applyStatus}>Update</button>
          </div>
        </div>
      </div>
    </div>
  )
}
