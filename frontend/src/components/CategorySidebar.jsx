import { Link } from 'react-router-dom';

export default function CategorySidebar({ categories = [] }) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Top Categories</h3>
        </div>
        <ul className="divide-y divide-gray-100">
          {categories.map((category) => {
            const name = typeof category === 'string' ? category : category?.name;
            const key = typeof category === 'string' ? category : category?.id;
            if (!name || !key) return null;
            return (
              <li key={key}>
                <Link
                  to={`/products?category=${encodeURIComponent(key)}`}
                  className="block px-5 py-3 text-sm text-gray-700 hover:text-[#F68B1E] hover:bg-orange-50"
                >
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}


