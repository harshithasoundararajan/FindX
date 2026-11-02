import { Link } from 'react-router-dom';

const CATEGORY_ICONS = {
  'Electronics': '🔌',
  'ID & Cards': '🪪',
  'Books & Stationery': '📘',
  'Accessories': '👓',
  'Bottles & Bags': '🧴',
  'Keys': '🔑',
  'Other': '📦'
};

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase();
}

export default function ItemCard({ item, onAction }) {
  const isLost = item.status === 'LOST';
  const icon = CATEGORY_ICONS[item.category] || '📦';

  return (
    <div className="item-card bg-white border-[1.5px] border-ink-900 rounded-[3px] shadow-card hover:-translate-y-[3px] transition-transform flex flex-col">
      <div className="h-[112px] bg-cream-100 flex items-center justify-center border-b-[1.5px] border-dashed border-ink-300 text-[34px]">
        {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" /> : icon}
      </div>
      <div className="p-[18px] pb-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-2">
          <span className="font-mono text-[10.5px] text-ink-300">#{item.id}</span>
          <span className={`font-mono text-[10px] tracking-wider px-2.5 py-[3px] rounded-full uppercase font-medium whitespace-nowrap ${isLost ? 'bg-lost-bg text-lost' : 'bg-found-bg text-found'}`}>
            {isLost ? 'Lost' : 'Found'}
          </span>
        </div>
        <Link to={`/items/${item.id}`} className="no-underline">
          <h4 className="font-display text-[16.5px] mt-2.5 leading-tight text-ink-900 hover:text-maroon-700">{item.title}</h4>
        </Link>
        <div className="text-[11.5px] text-maroon-700 font-semibold mt-1.5">{item.category}</div>
        <p className="text-[12.5px] text-ink-500 mt-2 leading-relaxed flex-1">{item.description}</p>
        <div className="mt-3.5 pt-3 border-t border-dashed border-ink-300 text-[11.5px] text-ink-700 flex flex-col gap-1 font-mono">
          <div className="flex justify-between gap-2"><span>LOCATION</span><span>{item.location}</span></div>
          <div className="flex justify-between gap-2"><span>DATE</span><span>{formatDate(item.date)}</span></div>
        </div>
        <button
          onClick={() => onAction(item)}
          className="mt-3.5 w-full py-2.5 border-[1.5px] border-maroon-700 bg-transparent text-maroon-700 font-semibold text-[12.5px] rounded-sm hover:bg-maroon-700 hover:text-white transition-colors"
        >
          {isLost ? 'I found this' : 'This is mine'}
        </button>
      </div>
    </div>
  );
}
