import Link from 'next/link';

export function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold">MyGhanaMarketplace</Link>
        <input className="w-1/2 rounded border p-2" placeholder="Search products" />
        <nav className="space-x-4">
          <Link href="/account">Account</Link>
          <Link href="/cart">Cart</Link>
        </nav>
      </div>
    </header>
  );
}


