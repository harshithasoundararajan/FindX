import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getItem } from '../api/itemService';
import { submitClaim } from '../api/claimService';
import { useAuth } from '../context/AuthContext';

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [reason, setReason] = useState('');
  const [proof, setProof] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getItem(id).then((res) => setItem(res.data)).catch(() => setItem(null));
  }, [id]);

  const handleClaim = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await submitClaim({ itemId: Number(id), reason, proof });
      setMessage('Claim submitted. Track its status from your dashboard.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not submit claim.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!item) return <div className="wrap py-16 text-ink-500">Loading…</div>;

  const isLost = item.status === 'LOST';

  return (
    <div className="wrap py-12 max-w-[720px]">
      <Link to="/" className="text-maroon-700 text-sm no-underline hover:underline">&larr; Back to listings</Link>

      <div className="bg-white border-[1.5px] border-ink-900 rounded-[3px] shadow-card mt-5 p-7">
        <div className="flex justify-between items-start gap-3 flex-wrap">
          <div>
            <span className="font-mono text-xs text-ink-300">#{item.id}</span>
            <h2 className="font-display text-2xl text-ink-900 mt-1">{item.title}</h2>
          </div>
          <span className={`font-mono text-[10px] tracking-wider px-2.5 py-1 rounded-full uppercase font-medium ${isLost ? 'bg-lost-bg text-lost' : 'bg-found-bg text-found'}`}>
            {item.status}
          </span>
        </div>

        {item.imageUrl && (
          <img src={item.imageUrl} alt={item.title} className="w-full max-h-[360px] object-cover rounded-sm border border-cream-200 mt-5" />
        )}

        <p className="text-ink-700 leading-relaxed mt-4">{item.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-dashed border-ink-300 font-mono text-[12px] text-ink-700">
          <div><div className="text-ink-500 mb-1">CATEGORY</div>{item.category}</div>
          <div><div className="text-ink-500 mb-1">LOCATION</div>{item.location}</div>
          <div><div className="text-ink-500 mb-1">DATE</div>{item.date}</div>
          <div><div className="text-ink-500 mb-1">REPORTED BY</div>{item.ownerName}</div>
        </div>

        {item.status !== 'CLAIMED' && item.status !== 'RETURNED' && (
          <div className="mt-7 pt-6 border-t border-cream-200">
            <h3 className="font-display text-lg mb-3">Submit a claim</h3>
            {!user ? (
              <p className="text-sm text-ink-500">
                <Link to="/login" className="text-maroon-700 font-semibold no-underline hover:underline">Sign in</Link> to submit a claim on this item.
              </p>
            ) : (
              <form onSubmit={handleClaim}>
                <div className="mb-3">
                  <label className="block text-[12.5px] font-semibold text-ink-700 mb-1.5">Why is this yours / how did you find it?</label>
                  <textarea value={reason} onChange={(e) => setReason(e.target.value)} required className="w-full px-3 py-2.5 border-[1.5px] border-cream-200 rounded-sm text-[13.5px] min-h-[70px]" />
                </div>
                <div className="mb-4">
                  <label className="block text-[12.5px] font-semibold text-ink-700 mb-1.5">Proof / identifying detail (optional)</label>
                  <input value={proof} onChange={(e) => setProof(e.target.value)} className="w-full px-3 py-2.5 border-[1.5px] border-cream-200 rounded-sm text-[13.5px]" />
                </div>
                {error && <p className="text-lost text-sm mb-3">{error}</p>}
                {message && <p className="text-found text-sm mb-3">{message}</p>}
                <button type="submit" disabled={submitting} className="bg-maroon-700 text-white border-none px-6 py-2.5 font-semibold text-[13.5px] rounded-sm hover:bg-maroon-600 disabled:opacity-60 transition-colors">
                  {submitting ? 'Submitting…' : 'Submit claim'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
