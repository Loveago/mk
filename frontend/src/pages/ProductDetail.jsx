import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    getProduct(id)
      .then((data) => {
        if (!isCancelled) setProduct(data);
      })
      .catch(() => {
        if (!isCancelled) setProduct(null);
      })
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });
    return () => {
      isCancelled = true;
    };
  }, [id]);

  if (loading)
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 text-center text-sm text-gray-500">
        Loading product details...
      </div>
    );

  if (!product)
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 text-center text-sm text-gray-500">
        Product not found.
      </div>
    );

  const images = Array.isArray(product.images) ? product.images : [];
  const primaryImage = product.image || images[0]?.url || images[0] || FALLBACK_IMAGE;
  const title = product.title || 'Product';
  const price = Number(product.price) || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <img src={primaryImage} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#F68B1E]">MK Verified</p>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-xs text-gray-500 mt-1">{product.category?.name}</p>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-extrabold text-[#F68B1E]">GH₵{price.toLocaleString()}</p>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Experience premium quality with fast delivery across Ghana. All items are covered by 7-day return policy and
          12-month warranty by the manufacturer.
        </p>
        <div className="space-y-3 text-sm text-gray-600">
          <h3 className="font-semibold text-gray-900">Highlights</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#F68B1E]" /> Genuine components guaranteed
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#F68B1E]" /> Pay with MoMo, Card or COD
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#F68B1E]" /> Free returns within 7 days
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#F68B1E]" /> Shipped from Accra warehouse
            </li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => addItem({ id: product.id, name: title, price, image: primaryImage })}
            className="inline-flex items-center justify-center rounded-full bg-[#F68B1E] px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#e57910]"
          >
            Add to Cart
          </button>
          <button className="inline-flex items-center justify-center rounded-full border border-[#F68B1E] px-8 py-3 text-sm font-semibold text-[#F68B1E] hover:bg-orange-50">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}


