export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-4xl p-4">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <form className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <input className="rounded border p-2" placeholder="Full name" />
        <input className="rounded border p-2" placeholder="Phone" />
        <input className="rounded border p-2 md:col-span-2" placeholder="Address" />
        <select className="rounded border p-2 md:col-span-2">
          <option>Greater Accra</option>
          <option>Ashanti</option>
        </select>
        <button className="rounded bg-black px-4 py-2 text-white md:col-span-2">Place order</button>
      </form>
    </main>
  );
}


