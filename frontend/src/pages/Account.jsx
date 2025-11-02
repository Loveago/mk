import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getCustomerOrders } from '../services/api.js';

const quickLinks = [
  { label: 'Track Orders', to: '/orders', description: 'View status of ongoing orders' },
  { label: 'Manage Addresses', to: '/account/addresses', description: 'Delivery & pickup locations' },
  { label: 'Saved Items', to: '/wishlist', description: 'Items you love' },
];

export default function Account() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCustomerOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="rounded-3xl bg-white px-8 py-10 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#F68B1E]">Welcome back</p>
          <h1 className="text-3xl font-bold text-gray-900">{user?.name || 'Valued Customer'}</h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
        <div className="grid gap-2 text-sm text-gray-600">
          <span className="font-semibold text-gray-900">Loyalty Status</span>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#F68B1E] uppercase">
            {user?.role}
          </span>
          <p>Member since 2024 • {orders.length} orders completed</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {quickLinks.map((link) => (
              <button
                key={link.label}
                className="rounded-2xl border border-gray-200 bg-orange-50/30 px-4 py-5 text-left transition hover:border-[#F68B1E]"
              >
                <p className="text-sm font-semibold text-gray-900">{link.label}</p>
                <p className="mt-1 text-xs text-gray-500">{link.description}</p>
              </button>
            ))}
          </div>
        </section>

        <aside className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          {loading ? (
            <p className="text-sm text-gray-500">Loading order history...</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-gray-500">No orders yet. Start shopping to unlock great deals!</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="rounded-xl border border-gray-200 px-4 py-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</span>
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-[#F68B1E] uppercase">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-500 mt-1">
                    {order.orderItems?.length || 0} item(s) • GH₵{Number(order.total).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

