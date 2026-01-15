export default function CartPage() {
  return (
    <main className="mx-auto max-w-4xl p-4">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      <div className="mt-6 space-y-4">
        {[1,2].map((i) => (
          <div key={i} className="flex items-center justify-between rounded border bg-white p-4">
            <div>Sample Product {i}</div>
            <div>GHS {(i*100).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right">
        <button className="rounded bg-black px-4 py-2 text-white">Checkout</button>
      </div>
    </main>
  );
}


