import ProductCard from './ProductCard.jsx';

export default function FlashSaleSection({ products = [], loading = false }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-5 bg-gradient-to-r from-[#F68B1E]/10 to-white">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Flash Sale</h3>
          <p className="text-sm text-gray-600">Limited time offers • Updated hourly</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-[#F68B1E]">
          Ends in
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F68B1E] text-white px-3 py-1">
            02 : 15 : 47
          </span>
        </div>
      </div>
      <div className="grid gap-4 px-6 pb-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
            ))
          : products.map((product) => <ProductCard key={product.id} product={product} variant="flash" />)}
      </div>
    </section>
  );
}


