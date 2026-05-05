'use client'
import { useState, useEffect, useRef } from 'react'
import { getSession, saveSession } from '../lib/storage'
import LoginPage from './LoginPage'
import FeedPage from './FeedPage'
import CreatePage from './CreatePage'
import DetailPage from './DetailPage'
import AdminPage from './AdminPage'

export default function CampusVoiceApp() {
  const [page, setPage] = useState(null) // null = loading
  const [currentUser, setCurrentUser] = useState(null)
  const [feedFilter, setFeedFilter] = useState('all')
  const [currentPostId, setCurrentPostId] = useState(null)
  const [toast, setToast] = useState('')
  const toastTimer = useRef(null)

  useEffect(() => {
    const session = getSession()
    if (session) {
      setCurrentUser(session)
      setPage(session.isAdmin ? 'admin' : 'feed')
    } else {
      setPage('login')
    }
  }, [])

  function showToast(msg) {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2500)
  }

  function handleLogin(user, type) {
    setCurrentUser(user)
    if (type === 'register') showToast('Account created! Welcome 🎉')
    setPage(user.isAdmin ? 'admin' : 'feed')
    setFeedFilter('all')
  }

  function goFeed() { setFeedFilter('all'); setPage('feed') }
  function goMyPosts() { setFeedFilter('my'); setPage('feed') }
  function goCreate() { setPage('create') }
  function goDetail(id) { setCurrentPostId(id); setPage('detail') }
  function goAdmin() { setPage('admin') }

  function handleAvatarClick() {
    if (currentUser?.isAdmin) {
      goAdmin()
    } else {
      if (window.confirm(`Logged in as ${currentUser?.name || 'user'}.\n\nClick OK to log out.`)) {
        saveSession(null); setCurrentUser(null); setPage('login')
      }
    }
  }

  if (!page) return null // hydration guard

  return (
    <>
      {/* NAVBAR */}
      {page !== 'login' && (
        <nav className="navbar">
          <div className="navbar-inner">
            <div className="nav-brand" onClick={goFeed}>CampusVoice</div>
            <div className="nav-links">
              <button className={`nav-btn ${(page === 'feed' || page === 'detail') ? 'active' : ''}`} onClick={goFeed}>Feed</button>
              <button className={`nav-btn ${feedFilter === 'my' && page === 'feed' ? 'active' : ''}`} onClick={goMyPosts}>My posts</button>
              <button className={`nav-btn ${page === 'create' ? 'active' : ''}`} onClick={goCreate}>New post</button>
            </div>
            <div className="nav-avatar" title={currentUser?.name || ''} onClick={handleAvatarClick}>
              {currentUser?.initials || 'BS'}
            </div>
          </div>
        </nav>
      )}

      {/* PAGES */}
      {page === 'login' && <LoginPage onLogin={handleLogin} />}
      {page === 'feed' && (
        <FeedPage
          currentUser={currentUser}
          feedFilter={feedFilter}
          onDetail={goDetail}
          onToast={showToast}
        />
      )}
      {page === 'create' && (
        <CreatePage currentUser={currentUser} onBack={goFeed} onToast={showToast} />
      )}
      {page === 'detail' && (
        <DetailPage postId={currentPostId} currentUser={currentUser} onBack={goFeed} onToast={showToast} />
      )}
      {page === 'admin' && (
        <AdminPage onDetail={goDetail} onToast={showToast} />
      )}

      {/* TOAST */}
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  )
}
