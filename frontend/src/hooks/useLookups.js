import { useEffect, useState } from 'react';
import { getCategories, getLocations } from '../api/lookupService';

export function useLookups() {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data || [])).catch(() => setCategories([]));
    getLocations().then((res) => setLocations(res.data || [])).catch(() => setLocations([]));
  }, []);

  return { categories, locations };
}
