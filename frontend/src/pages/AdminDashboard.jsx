import { useEffect, useState, useCallback } from 'react';
import {
  getStats, getAllClaims, decideClaim, getUsers, setUserStatus,
  createCategory, deleteCategory, createLocation, deleteLocation
} from '../api/adminService';
import { searchItems, markItemReturned, deleteItem } from '../api/itemService';
import { getCategories, getLocations } from '../api/lookupService';

const TABS = [
  ['claims', 'Pending claims'],
  ['items', 'Items'],
  ['lookups', 'Categories & locations'],
  ['users', 'Users']
];

const statusBadge = (status) => {
  const map = {
    LOST: 'bg-lost-bg text-lost', FOUND: 'bg-found-bg text-found',
    CLAIMED: 'bg-gold-500/20 text-maroon-700', RETURNED: 'bg-cream-200 text-ink-500'
  };
  return `font-mono text-[10px] tracking-wider px-2.5 py-1 rounded-full uppercase font-medium ${map[status] || 'bg-cream-200 text-ink-500'}`;
};

const errorMessage = (err, fallback) => err?.response?.data?.message || fallback;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [claims, setClaims] = useState([]);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [tab, setTab] = useState('claims');
  const [notice, setNotice] = useState({ type: '', text: '' });

  const loadStats = useCallback(() => {
    getStats().then((res) => setStats(res.data)).catch(() => setStats(null));
  }, []);
  const loadClaims = useCallback(() => {
    getAllClaims({ status: 'PENDING', page: 0, size: 50 }).then((res) => setClaims(res.data.content)).catch(() => setClaims([]));
  }, []);
  const loadUsers = useCallback(() => {
    getUsers({ page: 0, size: 50 }).then((res) => setUsers(res.data.content)).catch(() => setUsers([]));
  }, []);
  const loadItems = useCallback(() => {
    searchItems({ status: 'all', page: 0, size: 100 }).then((res) => setItems(res.data.content)).catch(() => setItems([]));
  }, []);
  const loadLookups = useCallback(() => {
    getCategories().then((res) => setCategories(res.data || [])).catch(() => setCategories([]));
    getLocations().then((res) => setLocations(res.data || [])).catch(() => setLocations([]));
  }, []);

  useEffect(() => {
    loadStats(); loadClaims(); loadUsers(); loadItems(); loadLookups();
  }, [loadStats, loadClaims, loadUsers, loadItems, loadLookups]);

  // Runs an admin action, shows a success/error notice and refreshes whatever changed.
  const run = async (action, successText, refresh) => {
    setNotice({ type: '', text: '' });
    try {
      await action();
      setNotice({ type: 'ok', text: successText });
      refresh && refresh();
    } catch (err) {
      setNotice({ type: 'err', text: errorMessage(err, 'Action failed. Please try again.') });
    }
  };

  const handleDecision = (id, decision) =>
    run(() => decideClaim(id, decision), `Claim ${decision.toLowerCase()}.`, () => { loadClaims(); loadStats(); loadItems(); });

  const toggleUser = (id, enabled) =>
    run(() => setUserStatus(id, !enabled), enabled ? 'User disabled.' : 'User enabled.', loadUsers);

  const handleReturned = (id) =>
    run(() => markItemReturned(id), 'Item marked as returned.', () => { loadItems(); loadStats(); });

  const handleDeleteItem = (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    run(() => deleteItem(id), 'Item deleted.', () => { loadItems(); loadStats(); });
  };

  const addCategory = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    run(() => createCategory({ name: newCategory.trim() }), 'Category added.', () => { setNewCategory(''); loadLookups(); });
  };
  const addLocation = (e) => {
    e.preventDefault();
    if (!newLocation.trim()) return;
    run(() => createLocation({ name: newLocation.trim() }), 'Location added.', () => { setNewLocation(''); loadLookups(); });
  };
  const removeCategory = (id) => run(() => deleteCategory(id), 'Category deleted.', loadLookups);
  const removeLocation = (id) => run(() => deleteLocation(id), 'Location deleted.', loadLookups);

  const th = 'py-2.5 pr-4';
  const headRow = 'text-left text-ink-500 font-mono text-[11px] uppercase border-b border-cream-200';

  return (
    <div className="wrap py-12">
      <h2 className="font-display text-2xl text-ink-900 mb-1">Admin dashboard</h2>
      <p className="text-ink-500 text-sm mb-8">Manage users, claims, items, and campus lookups.</p>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-9">
          {[
            ['Total users', stats.totalUsers], ['Total items', stats.totalItems],
            ['Lost', stats.totalLost], ['Found', stats.totalFound],
            ['Claimed', stats.totalClaimed], ['Returned', stats.totalReturned],
            ['Pending claims', stats.pendingClaims]
          ].map(([label, value]) => (
            <div key={label} className="bg-white border-[1.5px] border-ink-900 rounded-[3px] p-4 shadow-card">
              <div className="font-display text-2xl text-maroon-700">{value}</div>
              <div className="text-[11px] text-ink-500 font-mono uppercase mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap bg-cream-100 rounded-sm p-[3px] mb-6 w-fit">
        {TABS.map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className={`px-5 py-2.5 text-[13px] font-semibold rounded-sm ${tab === key ? 'bg-maroon-700 text-cream-50' : 'text-ink-500'}`}>
            {label}
          </button>
        ))}
      </div>

      {notice.text && (
        <p className={`text-sm mb-4 ${notice.type === 'ok' ? 'text-found' : 'text-lost'}`}>{notice.text}</p>
      )}

      {tab === 'claims' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className={headRow}>
                <th className={th}>Item</th><th className={th}>Claimant</th><th className={th}>Reason</th><th className={th}>Proof</th><th className={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c) => (
                <tr key={c.id} className="border-b border-cream-200">
                  <td className="py-3 pr-4 font-medium text-ink-900">{c.itemTitle}</td>
                  <td className="py-3 pr-4 text-ink-700">{c.claimerName}</td>
                  <td className="py-3 pr-4 text-ink-700 max-w-[260px] truncate" title={c.reason}>{c.reason}</td>
                  <td className="py-3 pr-4 text-ink-700 max-w-[200px] truncate" title={c.proof}>{c.proof || '—'}</td>
                  <td className="py-3 pr-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleDecision(c.id, 'APPROVED')} className="px-3 py-1.5 bg-found text-white text-xs font-semibold rounded-sm">Approve</button>
                      <button onClick={() => handleDecision(c.id, 'REJECTED')} className="px-3 py-1.5 bg-lost text-white text-xs font-semibold rounded-sm">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!claims.length && <tr><td colSpan={5} className="py-8 text-center text-ink-500">No pending claims.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'items' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className={headRow}>
                <th className={th}>Title</th><th className={th}>Category</th><th className={th}>Location</th><th className={th}>Reported by</th><th className={th}>Status</th><th className={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-b border-cream-200">
                  <td className="py-3 pr-4 font-medium text-ink-900">{it.title}</td>
                  <td className="py-3 pr-4 text-ink-700">{it.category}</td>
                  <td className="py-3 pr-4 text-ink-700">{it.location}</td>
                  <td className="py-3 pr-4 text-ink-700">{it.ownerName}</td>
                  <td className="py-3 pr-4"><span className={statusBadge(it.status)}>{it.status}</span></td>
                  <td className="py-3 pr-4">
                    <div className="flex gap-2">
                      {it.status !== 'RETURNED' && (
                        <button onClick={() => handleReturned(it.id)} className="px-3 py-1.5 border border-maroon-700 text-maroon-700 text-xs font-semibold rounded-sm hover:bg-maroon-700 hover:text-white transition-colors">
                          Mark returned
                        </button>
                      )}
                      <button onClick={() => handleDeleteItem(it.id, it.title)} className="px-3 py-1.5 bg-lost text-white text-xs font-semibold rounded-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={6} className="py-8 text-center text-ink-500">No items reported yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'lookups' && (
        <div className="grid md:grid-cols-2 gap-8">
          {[
            ['Categories', categories, newCategory, setNewCategory, addCategory, removeCategory],
            ['Locations', locations, newLocation, setNewLocation, addLocation, removeLocation]
          ].map(([title, list, value, setValue, onAdd, onRemove]) => (
            <div key={title} className="bg-white border-[1.5px] border-ink-900 rounded-[3px] shadow-card p-5">
              <h3 className="font-display text-lg mb-3">{title}</h3>
              <form onSubmit={onAdd} className="flex gap-2 mb-4">
                <input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={`New ${title.slice(0, -1).toLowerCase()} name`}
                  className="flex-1 px-3 py-2 border-[1.5px] border-cream-200 rounded-sm text-[13.5px]"
                />
                <button type="submit" className="px-4 py-2 bg-maroon-700 text-white text-[13px] font-semibold rounded-sm hover:bg-maroon-600 transition-colors">Add</button>
              </form>
              <ul className="divide-y divide-cream-200">
                {list.map((entry) => (
                  <li key={entry.id} className="flex justify-between items-center py-2.5 text-sm">
                    <span className="text-ink-900">{entry.name}</span>
                    <button onClick={() => onRemove(entry.id)} className="text-xs text-lost font-semibold hover:underline">Delete</button>
                  </li>
                ))}
                {!list.length && <li className="py-4 text-center text-ink-500 text-sm">Nothing here yet.</li>}
              </ul>
            </div>
          ))}
        </div>
      )}

      {tab === 'users' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className={headRow}>
                <th className={th}>Name</th><th className={th}>Email</th><th className={th}>Role</th><th className={th}>Status</th><th className={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-cream-200">
                  <td className="py-3 pr-4 font-medium text-ink-900">{u.name}</td>
                  <td className="py-3 pr-4 text-ink-700">{u.email}</td>
                  <td className="py-3 pr-4 text-ink-700">{u.role}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs font-mono px-2 py-1 rounded-full uppercase ${u.enabled ? 'bg-found-bg text-found' : 'bg-lost-bg text-lost'}`}>
                      {u.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {u.role !== 'ADMIN' && (
                      <button onClick={() => toggleUser(u.id, u.enabled)} className="px-3 py-1.5 border border-maroon-700 text-maroon-700 text-xs font-semibold rounded-sm hover:bg-maroon-700 hover:text-white transition-colors">
                        {u.enabled ? 'Disable' : 'Enable'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!users.length && <tr><td colSpan={5} className="py-8 text-center text-ink-500">No users found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
