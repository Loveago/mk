import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#333333] text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <Link to="/" className="text-2xl font-bold text-white">
            MK Marketplace
          </Link>
          <p className="text-sm text-gray-300">
            Ghana’s trusted marketplace for authentic products, fast delivery, and unbeatable deals.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Help Center</h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-300">
            <li><Link to="/help" className="hover:text-white">Customer Care</Link></li>
            <li><Link to="/orders" className="hover:text-white">Track My Order</Link></li>
            <li><Link to="/returns" className="hover:text-white">Returns & Refunds</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Make Money</h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-300">
            <li><Link to="/register?vendor=true" className="hover:text-white">Sell on MK</Link></li>
            <li><Link to="/affiliate" className="hover:text-white">Become an Affiliate</Link></li>
            <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Stay Connected</h4>
          <p className="text-sm text-gray-300">
            Subscribe for updates on deals, flash sales and exclusive offers.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Enter email"
              className="flex-1 rounded-l-full bg-white/10 px-4 py-2 text-sm focus:outline-none"
            />
            <button className="rounded-r-full bg-[#F68B1E] px-4 py-2 text-sm font-semibold text-white">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} MK Marketplace. Built for Ghana & beyond.
      </div>
    </footer>
  );
}


