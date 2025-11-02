import ProductCard from './ProductCard.jsx';

export default function FeaturedProducts({ products = [] }) {
  return (
    <section className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Featured Products</h3>
          <p className="text-sm text-gray-600">Top picks curated for you</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <button className="rounded-full border border-gray-200 px-3 py-1.5 hover:border-[#F68B1E] hover:text-[#F68B1E]">
            Best Sellers
          </button>
          <button className="rounded-full border border-gray-200 px-3 py-1.5 hover:border-[#F68B1E] hover:text-[#F68B1E]">
            New Arrivals
          </button>
          <button className="rounded-full border border-gray-200 px-3 py-1.5 hover:border-[#F68B1E] hover:text-[#F68B1E]">
            Top Rated
          </button>
        </div>
      </div>
      {products.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500">
          Products will appear here soon.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}


