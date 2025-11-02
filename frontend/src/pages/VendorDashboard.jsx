import { useEffect, useMemo, useState } from 'react';
import { getVendorOrders } from '../services/api.js';

export default function VendorDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVendorOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const metrics = useMemo(() => {
    const grossSales = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const pending = orders.filter((order) => ['PENDING', 'PROCESSING'].includes(order.status)).length;
    return {
      totalOrders: orders.length,
      grossSales,
      pending,
    };
  }, [orders]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#F68B1E]">Vendor HQ</p>
          <h1 className="text-3xl font-bold text-gray-900">Store Performance</h1>
          <p className="text-sm text-gray-500">Monitor orders, products and payouts in real-time.</p>
        </div>
        <button className="rounded-full bg-[#F68B1E] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#e57910]">
          Add New Product
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard title="Total Orders" value={metrics.totalOrders} subtitle="All time" />
        <MetricCard title="Gross Sales" value={`GH₵${metrics.grossSales.toLocaleString()}`} subtitle="Settled daily at 8PM" />
        <MetricCard title="Pending Shipments" value={metrics.pending} subtitle="Requires action" />
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading vendor orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-gray-500">No orders yet. Promote your products to boost sales.</p>
        ) : (
          <div className="space-y-4 text-sm">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
                <div>
                  <p className="font-semibold text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-gray-500">{order.orderItems?.length || 0} item(s) • GH₵{Number(order.total).toLocaleString()}</p>
                </div>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-[#F68B1E] uppercase">
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function MetricCard({ title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</p>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}


