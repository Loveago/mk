import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { createOrder } from '../services/api.js';

const shippingOptions = [
  { id: 'standard', label: 'Standard Delivery (2-4 days)', fee: 25 },
  { id: 'express', label: 'Express Delivery (1 day)', fee: 60 },
];

const paymentMethods = ['Mobile Money (MTN)', 'Credit/Debit Card', 'Cash on Delivery'];

export default function Checkout() {
  const navigate = useNavigate();
  const { totals, items, clearCart } = useCart();
  const [shipping, setShipping] = useState(shippingOptions[0]);
  const [payment, setPayment] = useState(paymentMethods[0]);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    region: '',
    city: '',
    address: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const grandTotal = useMemo(() => (items.length ? totals.total + shipping.fee : totals.total), [items.length, totals.total, shipping.fee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!items.length) {
      setError('Your cart is empty. Please add items before checking out.');
      return;
    }
    if (!form.fullName || !form.phone || !form.region || !form.city || !form.address) {
      setError('Please complete all delivery address fields.');
      return;
    }

    const payload = {
      items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
      paymentMethod: payment,
      shippingInfo: {
        ...form,
        shippingOption: shipping.id,
        shippingFee: shipping.fee,
      },
    };

    try {
      setSubmitting(true);
      setError('');
      const order = await createOrder(payload);
      clearCart();
      setSuccess('Order placed successfully! Redirecting to your account...');
      setTimeout(() => navigate('/account', { replace: true, state: { recentOrderId: order.id } }), 1200);
    } catch (err) {
      const message = err?.response?.data?.message || 'Could not place order. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="text-sm text-gray-600">Browse our collections and add items to your cart before checking out.</p>
        <div className="flex justify-center gap-3">
          <Link to="/products" className="inline-flex items-center rounded-full bg-[#F68B1E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#e57910]">
            Explore Products
          </Link>
          <Link to="/" className="inline-flex items-center rounded-full border border-[#F68B1E] px-6 py-3 text-sm font-semibold text-[#F68B1E] hover:bg-orange-50">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-6">
        <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full Name" name="fullName" placeholder="Ama Mensah" value={form.fullName} onChange={handleChange} required />
            <Input label="Phone Number" name="phone" placeholder="054 123 4567" value={form.phone} onChange={handleChange} required />
            <Input label="Region" name="region" placeholder="Greater Accra" value={form.region} onChange={handleChange} required />
            <Input label="City" name="city" placeholder="Accra" value={form.city} onChange={handleChange} required />
            <Input
              label="Address Line"
              name="address"
              placeholder="Ring Road, Dansoman"
              className="sm:col-span-2"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Method</h2>
          <div className="space-y-3">
            {shippingOptions.map((option) => (
              <label
                key={option.id}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition cursor-pointer ${
                  shipping.id === option.id ? 'border-[#F68B1E] bg-orange-50/40' : 'border-gray-200 hover:border-[#F68B1E]'
                }`}
              >
                <div>
                  <p className="font-semibold text-gray-900">{option.label}</p>
                  <p className="text-xs text-gray-500">Delivered by MK Logistics</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-[#F68B1E]">GH₵{option.fee}</p>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shipping.id === option.id}
                    onChange={() => setShipping(option)}
                    className="accent-[#F68B1E]"
                  />
                </div>
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
          <div className="grid gap-3 sm:grid-cols-3 text-sm">
            {paymentMethods.map((method) => (
              <button
                key={method}
                onClick={() => setPayment(method)}
                className={`rounded-xl border px-3 py-3 font-semibold transition ${
                  payment === method ? 'border-[#F68B1E] bg-orange-50/40 text-[#F68B1E]' : 'border-gray-200 text-gray-700 hover:border-[#F68B1E]'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </section>
      </div>

      <aside className="space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
          <div className="space-y-3 text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-gray-600">
                <p>{item.quantity} × {item.name}</p>
                <p className="font-semibold text-gray-900">GH₵{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
            <div className="flex items-center justify-between text-gray-600">
              <span>Subtotal</span>
              <span>GH₵{totals.total.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Shipping ({shipping.label.split('(')[0].trim()})</span>
              <span>GH₵{shipping.fee}</span>
            </div>
            <div className="flex items-center justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>GH₵{grandTotal.toLocaleString()}</span>
            </div>
          </div>
          {error && <div className="rounded-xl bg-red-50 px-4 py-2 text-xs text-red-600">{error}</div>}
          {success && <div className="rounded-xl bg-green-50 px-4 py-2 text-xs text-green-600">{success}</div>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-[#F68B1E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#e57910] disabled:opacity-60"
          >
            {submitting ? 'Processing…' : 'Place Order Securely'}
          </button>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 text-xs text-gray-500">
          Payments are securely processed via MTN Mobile Money, Visa, Mastercard and Cash on Delivery. All orders are
          covered by our 7-day return policy.
        </div>
      </aside>
    </form>
  );
}

function Input({ label, className = '', ...props }) {
  return (
    <label className={`flex flex-col gap-2 text-sm text-gray-700 ${className}`}>
      <span className="font-semibold">{label}</span>
      <input
        {...props}
        className="rounded-xl border border-gray-200 bg-white px-4 py-2 focus:border-[#F68B1E] focus:outline-none"
      />
    </label>
  );
}

