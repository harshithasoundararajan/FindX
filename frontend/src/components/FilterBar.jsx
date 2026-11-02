export default function FilterBar({
  search, onSearchChange,
  status, onStatusChange,
  categoryId, onCategoryChange, categories,
  locationId, onLocationChange, locations,
  resultCount, totalCount
}) {
  return (
    <div className="sticky top-[73px] z-40 bg-cream-50/95 backdrop-blur-sm border-b border-cream-200">
      <div className="wrap py-4.5 flex gap-3.5 flex-wrap items-center">
        <div className="flex-1 min-w-[260px] relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#241416" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by item, location, or claim code…"
            className="w-full py-[11px] pl-[38px] pr-3.5 border-[1.5px] border-cream-200 rounded-sm bg-white text-sm text-ink-900 focus:border-maroon-500 outline-none"
          />
        </div>

        <div className="flex bg-cream-100 rounded-sm p-[3px]">
          {['all', 'lost', 'found'].map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={`px-4 py-2 text-[13px] font-semibold rounded-sm transition-colors ${status === s ? 'bg-maroon-700 text-cream-50' : 'text-ink-500'}`}
            >
              {s === 'all' ? 'All' : s === 'lost' ? 'Lost' : 'Found'}
            </button>
          ))}
        </div>

        <select value={categoryId} onChange={(e) => onCategoryChange(e.target.value)} className="px-3 py-[10px] border-[1.5px] border-cream-200 rounded-sm bg-white text-[13.5px] text-ink-700">
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <select value={locationId} onChange={(e) => onLocationChange(e.target.value)} className="px-3 py-[10px] border-[1.5px] border-cream-200 rounded-sm bg-white text-[13.5px] text-ink-700">
          <option value="all">All locations</option>
          {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>

        <span className="text-[12.5px] text-ink-500 font-mono whitespace-nowrap">{resultCount} of {totalCount} listings</span>
      </div>
    </div>
  );
}
