import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80';

export default function Cart() {
  const { items, totals, updateQuantity, removeItem } = useCart();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <Link to="/products" className="text-sm font-semibold text-[#F68B1E]">
          Continue shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-sm text-gray-500">
          Your cart is empty. Discover amazing deals on the home page.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
                <img src={item.image || FALLBACK_IMAGE} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />
                <div className="flex-1 space-y-2">
                  <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-lg font-bold text-[#F68B1E]">GH₵{(item.price * item.quantity).toLocaleString()}</p>
                  <div className="flex items-center gap-3 text-sm">
                    <label htmlFor={`qty-${item.id}`} className="text-gray-500">
                      Qty
                    </label>
                    <select
                      id={`qty-${item.id}`}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                      className="rounded-full border border-gray-200 px-3 py-1"
                    >
                      {[1, 2, 3, 4, 5].map((qty) => (
                        <option key={qty} value={qty}>
                          {qty}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs font-semibold text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>GH₵{totals.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Delivery (estimated)</span>
              <span>GH₵25</span>
            </div>
            <div className="flex items-center justify-between text-base font-bold text-gray-900">
              <span>Total</span>
              <span>GH₵{(totals.total + 25).toLocaleString()}</span>
            </div>
            <Link
              to="/checkout"
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#F68B1E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#e57910]"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

