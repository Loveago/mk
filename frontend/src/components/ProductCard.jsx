import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80';

export default function ProductCard({ product, variant = 'default' }) {
  const { addItem } = useCart();
  const images = Array.isArray(product.images) ? product.images : [];
  const firstImage = product.image || images[0]?.url || images[0] || FALLBACK_IMAGE;
  const title = product.title || product.name || 'Product';
  const price = Number(product.price) || 0;
  const oldPrice = product.oldPrice ? Number(product.oldPrice) : null;
  const rating = product.rating || product.averageRating;
  const discount = product.discount || (oldPrice ? Math.max(0, Math.round((1 - price / oldPrice) * 100)) : null);

  const badge = () => {
    if (variant === 'flash' && discount) {
      return (
        <span className="absolute left-3 top-3 rounded-full bg-[#F68B1E] px-2.5 py-1 text-[11px] font-semibold uppercase text-white">
          -{discount}%
        </span>
      );
    }
    if (rating) {
      return (
        <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase text-[#F68B1E] shadow">
          {Number(rating).toFixed(1)} ★
        </span>
      );
    }
    return null;
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/product/${product.id}`} className="aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={firstImage}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>
      {badge()}
      <div className="flex flex-1 flex-col gap-3 px-4 py-4">
        <Link to={`/product/${product.id}`} className="text-sm font-semibold text-gray-800 line-clamp-2">
          {title}
        </Link>
        <div className="space-y-1">
          <p className="text-lg font-bold text-[#F68B1E]">GH₵{price.toLocaleString()}</p>
          {oldPrice && <p className="text-xs text-gray-500 line-through">GH₵{oldPrice.toLocaleString()}</p>}
        </div>
        <button
          onClick={() => addItem({ id: product.id, name: title, price, image: firstImage }, 1)}
          className="mt-auto inline-flex items-center justify-center rounded-full bg-[#F68B1E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e57910]"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}


