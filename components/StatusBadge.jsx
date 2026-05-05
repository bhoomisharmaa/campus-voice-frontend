export default function StatusBadge({ status }) {
  if (status === 'Pending') return <span className="badge badge-pending">Pending</span>
  if (status === 'In progress') return <span className="badge badge-inprogress">In progress</span>
  return <span className="badge badge-resolved">Resolved</span>
}
