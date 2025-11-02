import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 max-w-2xl flex items-center bg-white border border-gray-200 rounded-full shadow-sm overflow-hidden"
    >
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products, brands and categories"
        className="flex-1 px-4 py-2 text-sm outline-none"
      />
      <button
        type="submit"
        className="bg-[#F68B1E] text-white px-4 py-2 flex items-center gap-2 text-sm font-medium"
      >
        <MagnifyingGlassIcon className="h-4 w-4" />
        Search
      </button>
    </form>
  );
}


