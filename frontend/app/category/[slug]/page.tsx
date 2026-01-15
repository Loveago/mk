import Link from 'next/link';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="text-2xl font-bold">Category: {slug}</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[1,2,3,4,5,6,7,8].map((i) => (
          <Link key={i} href={`/product/sample-${i}`} className="rounded border bg-white p-4 shadow-sm hover:shadow">
            <div className="aspect-square w-full bg-gray-200" />
            <div className="mt-2 font-medium">Product {i}</div>
            <div className="text-sm text-gray-600">GHS {(i*50).toFixed(2)}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}


