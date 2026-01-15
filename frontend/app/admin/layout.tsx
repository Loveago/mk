import { ReactNode } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-12">
      <aside className="col-span-3 border-r bg-white p-4 md:col-span-2">
        <h2 className="mb-4 text-lg font-semibold">Admin</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/categories">Categories</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/users">Users</Link>
          <Link href="/admin/settings">Settings</Link>
        </nav>
      </aside>
      <main className="col-span-9 p-6 md:col-span-10">{children}</main>
    </div>
  );
}


