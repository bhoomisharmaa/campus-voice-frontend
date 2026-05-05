export const SEED_POSTS = [
  {
    id: 's1',
    title: 'Hot water supply not working in Block C since 3 days',
    category: 'Hostel',
    status: 'Pending',
    description:
      'The hot water supply in Block C has not been working for the past 3 days. Students on floors 2 and 3 are affected, especially during early mornings. We have informed the warden verbally but no action has been taken so far.',
    author: 'Anonymous',
    authorKey: null,
    anon: true,
    time: Date.now() - 2 * 60 * 60 * 1000,
    upvotes: 48,
    downvotes: 3,
    comments: [
      { author: 'Rahul K.', text: 'Same issue in Block D as well. Maintenance team needs to act urgently.', time: Date.now() - 60 * 60 * 1000, color: '#4F46E5' },
      { author: 'Anonymous', text: 'Upvoted. This has been going on way too long. Please resolve it.', time: Date.now() - 45 * 60 * 1000, color: '#7C3AED' },
    ],
  },
  {
    id: 's2',
    title: 'Library should stay open till 9 PM during exam week',
    category: 'Academics',
    status: 'In progress',
    description:
      "During exam week, students need more study time. The library closing at 6 PM is very inconvenient. Many students don't have good study environments at home/hostel rooms.",
    author: 'Bhavishya K.',
    authorKey: null,
    anon: false,
    time: Date.now() - 24 * 60 * 60 * 1000,
    upvotes: 31,
    downvotes: 1,
    comments: [
      { author: 'Priya M.', text: 'Totally agree! Especially during finals.', time: Date.now() - 20 * 60 * 60 * 1000, color: '#D97706' },
    ],
  },
  {
    id: 's3',
    title: 'Mess menu not updated on notice board for 2 weeks',
    category: 'Mess',
    status: 'Resolved',
    description:
      'The mess notice board has not been updated with the weekly menu for the past 2 weeks. Students are unaware of what will be served, causing inconvenience in planning.',
    author: 'Devansh S.',
    authorKey: null,
    anon: false,
    time: Date.now() - 3 * 24 * 60 * 60 * 1000,
    upvotes: 19,
    downvotes: 0,
    comments: [],
  },
  {
    id: 's4',
    title: 'WiFi not working in lab block',
    category: 'Infrastructure',
    status: 'Pending',
    description:
      'The WiFi network in the computer lab block (building C) has been down for 5 days. Students cannot complete online assignments or access learning resources.',
    author: 'Ankit V.',
    authorKey: null,
    anon: false,
    time: Date.now() - 4 * 24 * 60 * 60 * 1000,
    upvotes: 15,
    downvotes: 2,
    comments: [],
  },
]

export function getPosts() {
  try {
    const s = localStorage.getItem('cv_posts')
    if (!s) {
      const seed = JSON.parse(JSON.stringify(SEED_POSTS))
      localStorage.setItem('cv_posts', JSON.stringify(seed))
      return seed
    }
    return JSON.parse(s)
  } catch {
    return JSON.parse(JSON.stringify(SEED_POSTS))
  }
}
export function savePosts(p) {
  try { localStorage.setItem('cv_posts', JSON.stringify(p)) } catch {}
}
export function getVotes() {
  try { return JSON.parse(localStorage.getItem('cv_votes') || '{}') } catch { return {} }
}
export function saveVotes(v) {
  try { localStorage.setItem('cv_votes', JSON.stringify(v)) } catch {}
}
export function getUsers() {
  try { return JSON.parse(localStorage.getItem('cv_users') || '[]') } catch { return [] }
}
export function saveUsers(u) {
  try { localStorage.setItem('cv_users', JSON.stringify(u)) } catch {}
}
export function getSession() {
  try { return JSON.parse(localStorage.getItem('cv_session') || 'null') } catch { return null }
}
export function saveSession(u) {
  try { localStorage.setItem('cv_session', JSON.stringify(u)) } catch {}
}
