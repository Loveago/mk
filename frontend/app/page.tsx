import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl p-4">
      <header className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold">MyGhanaMarketplace</h1>
        <nav className="space-x-4">
          <Link href="/admin">Admin</Link>
          <Link href="/vendor">Vendor</Link>
          <Link href="/cart">Cart</Link>
        </nav>
      </header>
      <section className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {["Electronics","Fashion","Home & Office","Appliances"].map((c) => (
          <Link key={c} href={`/category/${c.toLowerCase().replace(/\s+/g, '-')}`} className="rounded border bg-white p-4 shadow-sm hover:shadow">{c}</Link>
        ))}
      </section>
      <section className="mt-10">
        <h2 className="mb-3 text-xl font-semibold">Featured</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1,2,3,4].map((i) => (
            <Link key={i} href={`/product/sample-${i}`} className="rounded border bg-white p-4 shadow-sm hover:shadow">
              <div className="aspect-square w-full bg-gray-200" />
              <div className="mt-2 font-medium">Sample Product {i}</div>
              <div className="text-sm text-gray-600">GHS {(i*100).toFixed(2)}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}


