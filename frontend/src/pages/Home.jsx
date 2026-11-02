import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Hero from '../components/Hero';
import FilterBar from '../components/FilterBar';
import ItemCard from '../components/ItemCard';
import HowItWorks from '../components/HowItWorks';
import { searchItems } from '../api/itemService';

export default function Home() {
  const { openModal, categories, locations } = useOutletContext();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [categoryId, setCategoryId] = useState('all');
  const [locationId, setLocationId] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        keyword: search || undefined,
        status,
        categoryId: categoryId !== 'all' ? categoryId : undefined,
        locationId: locationId !== 'all' ? locationId : undefined,
        page: 0,
        size: 24
      };
      const res = await searchItems(params);
      setItems(res.data.content);
      setTotalCount(res.data.totalElements);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [search, status, categoryId, locationId]);

  useEffect(() => {
    const t = setTimeout(fetchItems, 250);
    return () => clearTimeout(t);
  }, [fetchItems]);

  const handleCardAction = (item) => {
    navigate(`/items/${item.id}`);
  };

  return (
    <>
      <Hero onLostClick={() => openModal('lost')} onFoundClick={() => openModal('found')} activeCount={totalCount} />

      <FilterBar
        search={search} onSearchChange={setSearch}
        status={status} onStatusChange={setStatus}
        categoryId={categoryId} onCategoryChange={setCategoryId} categories={categories}
        locationId={locationId} onLocationChange={setLocationId} locations={locations}
        resultCount={items.length} totalCount={totalCount}
      />

      <main className="py-11 pb-20">
        <div className="wrap">
          <div className="flex justify-between items-baseline mb-6.5 flex-wrap gap-2.5">
            <h3 className="font-display text-[23px]">Recent listings</h3>
            <span className="text-[12.5px] text-ink-500 font-mono">SORTED BY MOST RECENT</span>
          </div>

          {loading ? (
            <p className="text-ink-500 text-sm">Loading listings…</p>
          ) : items.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5.5">
              {items.map((item) => <ItemCard key={item.id} item={item} onAction={handleCardAction} />)}
            </div>
          ) : (
            <div className="text-center py-[70px] px-5 text-ink-500">
              <h4 className="text-[19px] text-ink-900 mb-2 font-display">No matches on the board</h4>
              <p className="text-[13.5px]">Try a different search term, or widen your filters.</p>
            </div>
          )}
        </div>
      </main>

      <HowItWorks />
    </>
  );
}
