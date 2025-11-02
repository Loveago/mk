import { useEffect, useState } from 'react';
import CategorySidebar from '../components/CategorySidebar.jsx';
import HeroCarousel from '../components/HeroCarousel.jsx';
import FlashSaleSection from '../components/FlashSaleSection.jsx';
import FeaturedProducts from '../components/FeaturedProducts.jsx';
import { getHomeContent } from '../services/api.js';

export default function Home() {
  const [data, setData] = useState({
    heroSlides: [],
    categories: [],
    flashSale: [],
    featuredProducts: [],
    topVendors: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomeContent()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div className="flex flex-col lg:flex-row gap-6">
        <CategorySidebar categories={data.categories} />
        <div className="flex-1 space-y-6">
          <HeroCarousel slides={data.heroSlides} />
          <FlashSaleSection products={data.flashSale} loading={loading} />
        </div>
      </div>

      <FeaturedProducts products={data.featuredProducts} />

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Why shop with MK Marketplace?</h3>
          <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-700">
            <FeatureCard title="Authentic Products" description="Direct from verified Ghanaian vendors" />
            <FeatureCard title="Same-Day Delivery" description="Available in Accra, Tema, Kumasi" />
            <FeatureCard title="Secure Payments" description="Mobile Money, Cards & Cash on Delivery" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Vendors</h3>
          <ul className="space-y-4">
            {data.topVendors.map((vendor) => (
              <li key={vendor.id} className="flex items-center justify-between text-sm text-gray-700">
                <span className="font-semibold text-gray-800">{vendor.storeName}</span>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-[#F68B1E]">
                  {vendor.totalProducts} products
                </span>
              </li>
            ))}
            {!data.topVendors.length && !loading && (
              <li className="text-xs text-gray-400">Vendors update soon.</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-orange-50/40 px-4 py-6 text-center shadow-sm">
      <h4 className="text-sm font-bold text-[#F68B1E] uppercase tracking-wide">{title}</h4>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}

