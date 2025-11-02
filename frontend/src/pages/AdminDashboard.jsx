import { useEffect, useMemo, useState } from 'react';
import {
  createAdminPromotion,
  deleteAdminPromotion,
  getAdminPromotions,
  getAdminSummary,
  getAdminUsers,
  getAdminVendors,
  getAllOrders,
  updateAdminUserStatus,
  updateAdminVendorStatus,
} from '../services/api.js';

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(true);
  const [promotionForm, setPromotionForm] = useState({
    title: '',
    discount: 10,
    startDate: '',
    endDate: '',
  });
  const [promotionError, setPromotionError] = useState('');
  const [promotionSaving, setPromotionSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryRes, usersRes, vendorsRes, promotionsRes] = await Promise.all([
          getAdminSummary(),
          getAdminUsers(),
          getAdminVendors(),
          getAdminPromotions(),
        ]);
        setSummary(summaryRes);
        setUsers(usersRes);
        setVendors(vendorsRes);
        setPromotions(promotionsRes);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setOrdering(false));
  }, []);

  const metrics = useMemo(() => {
    if (!summary) {
      return { orders: 0, gross: 0, delivered: 0, processing: 0 };
    }
    const delivered = orders.filter((order) => order.status === 'DELIVERED').length;
    const processing = orders.filter((order) => ['PENDING', 'PROCESSING'].includes(order.status)).length;
    return {
      orders: summary.orders,
      gross: summary.totalSales,
      delivered,
      processing,
    };
  }, [summary, orders]);

  const handleUserStatus = async (id, status) => {
    const next = await updateAdminUserStatus(id, status);
    setUsers((prev) => prev.map((user) => (user.id === id ? next : user)));
  };

  const handleVendorStatus = async (id, status) => {
    const next = await updateAdminVendorStatus(id, status);
    setVendors((prev) => prev.map((vendor) => (vendor.user?.id === id || vendor.id === id ? { ...vendor, user: next } : vendor)));
    setUsers((prev) => prev.map((user) => (user.id === id ? next : user)));
  };

  const handlePromotionSubmit = async (e) => {
    e.preventDefault();
    if (!promotionForm.title || !promotionForm.startDate || !promotionForm.endDate) {
      setPromotionError('Please complete all promotion fields.');
      return;
    }
    try {
      setPromotionSaving(true);
      setPromotionError('');
      const created = await createAdminPromotion(promotionForm);
      setPromotions((prev) => [created, ...prev]);
      setPromotionForm({ title: '', discount: 10, startDate: '', endDate: '' });
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to create promotion';
      setPromotionError(message);
    } finally {
      setPromotionSaving(false);
    }
  };

  const handleDeletePromotion = async (id) => {
    await deleteAdminPromotion(id);
    setPromotions((prev) => prev.filter((promo) => promo.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#F68B1E]">Admin Command Center</p>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace Overview</h1>
          <p className="text-sm text-gray-500">Manage users, vendors, products, promotions and payouts.</p>
        </div>
        <button className="rounded-full bg-white border border-[#F68B1E] px-6 py-3 text-sm font-semibold text-[#F68B1E] shadow-sm hover:bg-orange-50">
          Configure Settings
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Users"
          value={summary?.users ?? '—'}
          trend={summary ? `${summary.pendingVendors} vendors pending` : 'Loading…'}
        />
        <MetricCard label="Active Vendors" value={summary?.vendors ?? '—'} trend="All vendors" />
        <MetricCard
          label="Orders"
          value={metrics.orders}
          trend={ordering ? 'Loading…' : `${metrics.delivered} delivered`}
        />
        <MetricCard
          label="GMV (GH₵)"
          value={`GH₵${metrics.gross.toLocaleString()}`}
          trend="Gross merchandise volume"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Users</h2>
          {loading ? (
            <p className="text-sm text-gray-500">Loading users…</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-xs uppercase text-gray-500">
                    <th className="py-2">Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="py-2 font-semibold text-gray-800">{user.name}</td>
                      <td className="text-gray-500">{user.email}</td>
                      <td className="text-gray-500 uppercase">{user.role}</td>
                      <td>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="text-right space-x-2">
                        <ActionButton label="Activate" onClick={() => handleUserStatus(user.id, 'ACTIVE')} />
                        <ActionButton label="Suspend" tone="danger" onClick={() => handleUserStatus(user.id, 'SUSPENDED')} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Create Promotion</h2>
          <form className="space-y-3 text-sm" onSubmit={handlePromotionSubmit}>
            <Input label="Title" name="title" value={promotionForm.title} onChange={(e) => setPromotionForm({ ...promotionForm, title: e.target.value })} required />
            <Input
              label="Discount (%)"
              name="discount"
              type="number"
              min="1"
              max="90"
              value={promotionForm.discount}
              onChange={(e) => setPromotionForm({ ...promotionForm, discount: Number(e.target.value) })}
              required
            />
            <Input label="Start Date" type="date" value={promotionForm.startDate} onChange={(e) => setPromotionForm({ ...promotionForm, startDate: e.target.value })} required />
            <Input label="End Date" type="date" value={promotionForm.endDate} onChange={(e) => setPromotionForm({ ...promotionForm, endDate: e.target.value })} required />
            {promotionError && <div className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{promotionError}</div>}
            <button
              type="submit"
              disabled={promotionSaving}
              className="w-full rounded-full bg-[#F68B1E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e57910] disabled:opacity-60"
            >
              {promotionSaving ? 'Saving…' : 'Publish Promotion'}
            </button>
          </form>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Vendor Management</h2>
          {loading ? (
            <p className="text-sm text-gray-500">Loading vendors…</p>
          ) : vendors.length === 0 ? (
            <p className="text-sm text-gray-500">No vendors yet.</p>
          ) : (
            <div className="space-y-3">
              {vendors.map((vendor) => (
                <div key={vendor.id} className="rounded-2xl border border-gray-200 px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{vendor.user?.name || vendor.storeName}</p>
                    <p className="text-xs text-gray-500">{vendor.user?.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {vendor.metrics.orderCount} orders • GH₵{vendor.metrics.sales.toLocaleString()} sales • {vendor._count?.products ?? 0} products
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(vendor.user?.status)}`}>
                      {vendor.user?.status}
                    </span>
                    <ActionButton label="Approve" onClick={() => handleVendorStatus(vendor.user?.id ?? vendor.id, 'ACTIVE')} />
                    <ActionButton label="Suspend" tone="danger" onClick={() => handleVendorStatus(vendor.user?.id ?? vendor.id, 'SUSPENDED')} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Active Promotions</h2>
          {promotions.length === 0 ? (
            <p className="text-sm text-gray-500">No promotions yet.</p>
          ) : (
            <div className="space-y-3 text-sm text-gray-600">
              {promotions.map((promo) => (
                <div key={promo.id} className="rounded-xl border border-gray-200 px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{promo.title}</p>
                    <p className="text-xs text-gray-500">
                      {promo.discount}% • {new Date(promo.startDate).toLocaleDateString()} —{' '}
                      {new Date(promo.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeletePromotion(promo.id)}
                    className="text-xs font-semibold text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          {ordering ? (
            <p className="text-sm text-gray-500">Loading order data...</p>
          ) : orders.length === 0 ? (
            <p className="text-sm text-gray-500">No orders yet.</p>
          ) : (
            <div className="space-y-4 text-sm text-gray-600">
              {orders.slice(0, 6).map((order) => (
                <div key={order.id} className="rounded-2xl border border-gray-200 px-4 py-3 flex items-center justify-between">
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
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
          <StatusRow label="API Response" value="121ms" status="Healthy" />
          <StatusRow label="Checkout Success" value="98.4%" status="Stable" />
          <StatusRow label="Fraud Alerts" value="Low" status="Monitor" />
          <StatusRow label="DB Replication" value="OK" status="Healthy" />
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, trend }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-green-600 mt-1">{trend}</p>
    </div>
  );
}

function StatusRow({ label, value, status }) {
  const statusStyles = {
    Healthy: 'bg-green-100 text-green-600',
    Stable: 'bg-blue-100 text-blue-600',
    Monitor: 'bg-yellow-100 text-yellow-600',
  };

  return (
    <div className="flex items-center justify-between text-sm text-gray-600">
      <div>
        <p className="font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{value}</p>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status] || ''}`}>{status}</span>
    </div>
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

function ActionButton({ label, onClick, tone = 'default' }) {
  const base = 'text-xs font-semibold rounded-full border px-3 py-1 transition';
  const toneClass = tone === 'danger'
    ? 'border-red-300 text-red-500 hover:bg-red-50'
    : 'border-gray-200 text-gray-600 hover:border-[#F68B1E] hover:text-[#F68B1E]';
  return (
    <button onClick={onClick} className={`${base} ${toneClass}`} type="button">
      {label}
    </button>
  );
}

function badgeClass(status) {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-600';
    case 'SUSPENDED':
      return 'bg-red-100 text-red-600';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-600';
    default:
      return 'bg-gray-100 text-gray-500';
  }
}


