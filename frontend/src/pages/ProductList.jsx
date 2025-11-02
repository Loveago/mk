import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { getCategories, getProducts } from '../services/api.js';

const priceFilters = [
  { label: 'All', value: 'all' },
  { label: 'Under GH₵500', value: 'under-500' },
  { label: 'GH₵500 - GH₵1500', value: '500-1500' },
  { label: 'GH₵1500+', value: '1500-plus' },
];

export default function ProductList() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [price, setPrice] = useState('all');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get('q') || '');
    setCategory(params.get('category') || 'all');
  }, [location.search]);

  useEffect(() => {
    let isCancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const params = {
          q: searchTerm || undefined,
          categoryId: category !== 'all' ? category : undefined,
        };
        if (price === 'under-500') params.maxPrice = 500;
        if (price === '500-1500') {
          params.minPrice = 500;
          params.maxPrice = 1500;
        }
        if (price === '1500-plus') params.minPrice = 1500;

        const data = await getProducts(params);
        if (!isCancelled) {
          setProducts(data.items || []);
          setTotal(data.total ?? data.items?.length ?? 0);
        }
      } catch (err) {
        if (!isCancelled) {
          setProducts([]);
          setTotal(0);
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };
    fetch();
    return () => {
      isCancelled = true;
    };
  }, [searchTerm, category, price]);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      if (price === 'under-500') return product.price < 500;
      if (price === '500-1500') return product.price >= 500 && product.price <= 1500;
      if (price === '1500-plus') return product.price > 1500;
      return true;
    });
  }, [products, price]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
          <p className="text-sm text-gray-600">{total} items available from verified vendors</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-[#F68B1E]"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-[#F68B1E]"
          >
            {priceFilters.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search within results..."
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-[#F68B1E]"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center text-sm text-gray-500">
          Loading products...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center text-sm text-gray-500">
          No products match your filters yet. Try adjusting the search or category.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}


