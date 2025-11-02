import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const roles = [
  { label: 'Customer', value: 'CUSTOMER', description: 'Shop from thousands of vendors across Ghana.' },
  { label: 'Vendor', value: 'VENDOR', description: 'Sell nationwide with fast payouts and tools.' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: roles[0].value,
    name: '',
    email: '',
    phone: '',
    storeName: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Registration failed. Try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50 px-4 py-10">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-2xl border border-gray-100">
        <h2 className="text-3xl font-bold mb-3 text-center text-gray-900">Create your MK account</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Choose your role to get tailored experiences and offers.
        </p>
        {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-2 gap-3">
            {roles.map((role) => (
              <label
                key={role.value}
                className={`rounded-2xl border px-4 py-4 text-sm transition cursor-pointer ${
                  form.role === role.value ? 'border-[#F68B1E] bg-orange-50/40' : 'border-gray-200 hover:border-[#F68B1E]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">{role.label}</p>
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={form.role === role.value}
                    onChange={handleChange}
                    className="accent-[#F68B1E]"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">{role.description}</p>
              </label>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} />
            <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
            {form.role === 'VENDOR' && (
              <Input
                label="Store Name"
                name="storeName"
                value={form.storeName}
                onChange={handleChange}
                placeholder="E.g. Accra Gadgets"
                className="sm:col-span-2"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#F68B1E] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#e57910] disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#F68B1E]">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

function Input({ label, className = '', ...props }) {
  return (
    <label className={`flex flex-col gap-2 text-sm text-gray-700 ${className}`}>
      <span className="font-semibold">{label}</span>
      <input
        {...props}
        className="rounded-xl border border-gray-200 px-4 py-2 focus:border-[#F68B1E] focus:outline-none"
      />
    </label>
  );
}


