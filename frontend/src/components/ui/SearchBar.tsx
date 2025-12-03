'use client'
import { useState } from 'react'
import { Search, X } from 'lucide-react'

export default function SearchBar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex-1 flex justify-center">
      <div className="relative w-full max-w-3xl">
        <input
          onFocus={() => setSearchOpen(true)}
          placeholder="Search"
          className="hidden lg:block w-full bg-[#0f1535] border border-neutral-700/60 rounded-full py-2 pl-10 pr-10 text-sm text-neutral-200 placeholder:text-neutral-500 focus:outline-none"
          type="text"
        />
        <span className="hidden lg:flex absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
          <Search className="w-4 h-4 text-white" />
        </span>

        {searchOpen && (
          <button
            onClick={() => setSearchOpen(false)}
            className="hidden lg:flex absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
            aria-label="close search"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        )}
      </div>
    </div>
  )
}