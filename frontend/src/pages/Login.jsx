import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await login(form);
      const redirect = location.state?.from?.pathname || '/';
      navigate(redirect, { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Unable to login. Try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] bg-gray-50 px-4 py-10">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">Login to your account</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Access exclusive deals across Ghana.</p>
        {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <div className="text-right text-xs text-[#F68B1E] font-semibold cursor-pointer">Forgot password?</div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#F68B1E] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#e57910] disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          New to MK Marketplace?{' '}
          <Link to="/register" className="font-semibold text-[#F68B1E]">
            Create an account
          </Link>
        </p>
        <div className="mt-6 text-xs text-gray-400 text-center">
          Demo accounts: admin@example.com, vendor@example.com, customer@example.com (use any password)
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="flex flex-col gap-2 text-sm text-gray-700">
      <span className="font-semibold">{label}</span>
      <input
        {...props}
        className="rounded-xl border border-gray-200 px-4 py-2 focus:border-[#F68B1E] focus:outline-none"
      />
    </label>
  );
}


