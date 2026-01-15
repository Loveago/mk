import { ReactNode } from 'react';

export function Sidebar({ children }: { children: ReactNode }) {
  return <aside className="w-64 border-r bg-white p-4">{children}</aside>;
}


