'use client';
import { useState } from 'react';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [qty, setQty] = useState(1);
  return (
    <main className="mx-auto max-w-5xl p-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="aspect-square w-full bg-gray-200" />
        <div>
          <h1 className="text-2xl font-bold">Product: {slug}</h1>
          <div className="mt-2 text-xl">GHS 299.00</div>
          <p className="mt-4 text-gray-700">Sample description for {slug}.</p>
          <div className="mt-6 flex items-center space-x-2">
            <input type="number" className="w-20 rounded border p-2" value={qty} min={1} onChange={(e) => setQty(Number(e.target.value))} />
            <button className="rounded bg-black px-4 py-2 text-white">Add to cart</button>
          </div>
        </div>
      </div>
    </main>
  );
}


