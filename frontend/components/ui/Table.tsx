import { ReactNode } from 'react';

export function Table({ children }: { children: ReactNode }) {
  return <table className="w-full table-auto border-collapse text-left">{children}</table>;
}


