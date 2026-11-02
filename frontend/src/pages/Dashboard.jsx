import { useEffect, useState } from 'react';
import { getMyItems } from '../api/itemService';
import { getMyClaims } from '../api/claimService';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [tab, setTab] = useState('items');

  useEffect(() => {
    getMyItems({ page: 0, size: 50 }).then((res) => setItems(res.data.content)).catch(() => setItems([]));
    getMyClaims({ page: 0, size: 50 }).then((res) => setClaims(res.data.content)).catch(() => setClaims([]));
  }, []);

  const statusBadge = (status) => {
    const map = {
      LOST: 'bg-lost-bg text-lost', FOUND: 'bg-found-bg text-found',
      CLAIMED: 'bg-gold-500/20 text-maroon-700', RETURNED: 'bg-cream-200 text-ink-500',
      PENDING: 'bg-gold-500/20 text-maroon-700', APPROVED: 'bg-found-bg text-found', REJECTED: 'bg-lost-bg text-lost'
    };
    return `font-mono text-[10px] tracking-wider px-2.5 py-1 rounded-full uppercase font-medium ${map[status] || 'bg-cream-200 text-ink-500'}`;
  };

  return (
    <div className="wrap py-12">
      <h2 className="font-display text-2xl text-ink-900 mb-1">Welcome, {user?.name}</h2>
      <p className="text-ink-500 text-sm mb-8">Track everything you've reported and claimed.</p>

      <div className="flex bg-cream-100 rounded-sm p-[3px] mb-6 w-fit">
        <button onClick={() => setTab('items')} className={`px-5 py-2.5 text-[13px] font-semibold rounded-sm ${tab === 'items' ? 'bg-maroon-700 text-cream-50' : 'text-ink-500'}`}>My reports</button>
        <button onClick={() => setTab('claims')} className={`px-5 py-2.5 text-[13px] font-semibold rounded-sm ${tab === 'claims' ? 'bg-maroon-700 text-cream-50' : 'text-ink-500'}`}>My claims</button>
      </div>

      {tab === 'items' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-ink-500 font-mono text-[11px] uppercase border-b border-cream-200">
                <th className="py-2.5 pr-4">Title</th><th className="py-2.5 pr-4">Category</th><th className="py-2.5 pr-4">Location</th><th className="py-2.5 pr-4">Status</th><th className="py-2.5 pr-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b border-cream-200">
                  <td className="py-3 pr-4 font-medium text-ink-900">{it.title}</td>
                  <td className="py-3 pr-4 text-ink-700">{it.category}</td>
                  <td className="py-3 pr-4 text-ink-700">{it.location}</td>
                  <td className="py-3 pr-4"><span className={statusBadge(it.status)}>{it.status}</span></td>
                  <td className="py-3 pr-4 text-ink-700 font-mono">{it.date}</td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={5} className="py-8 text-center text-ink-500">You haven't reported any items yet.</td></tr>}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-ink-500 font-mono text-[11px] uppercase border-b border-cream-200">
                <th className="py-2.5 pr-4">Item</th><th className="py-2.5 pr-4">Reason</th><th className="py-2.5 pr-4">Status</th><th className="py-2.5 pr-4">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c) => (
                <tr key={c.id} className="border-b border-cream-200">
                  <td className="py-3 pr-4 font-medium text-ink-900">{c.itemTitle}</td>
                  <td className="py-3 pr-4 text-ink-700 max-w-[280px] truncate">{c.reason}</td>
                  <td className="py-3 pr-4"><span className={statusBadge(c.status)}>{c.status}</span></td>
                  <td className="py-3 pr-4 text-ink-700 font-mono">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {!claims.length && <tr><td colSpan={4} className="py-8 text-center text-ink-500">You haven't submitted any claims yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
