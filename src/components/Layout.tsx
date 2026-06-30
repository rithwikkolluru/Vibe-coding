import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ListChecks, Search } from "lucide-react";
import { SelectedListDrawer } from "./SelectedListDrawer";
import { useSelectedCount } from "@/store/useSelectedListStore";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const selectedCount = useSelectedCount();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-violet-600 hover:text-violet-700 transition-colors"
            >
              <Search size={22} className="text-violet-500" />
              <span>Wobb</span>
            </Link>

            {title && (
              <h1 className="hidden sm:block text-sm font-medium text-slate-500 truncate max-w-xs">
                {title}
              </h1>
            )}

            <button
              onClick={() => setDrawerOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
              aria-label={`Open selected list (${selectedCount} items)`}
            >
              <ListChecks size={18} />
              <span className="hidden sm:inline">My List</span>
              {selectedCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold leading-none">
                  {selectedCount > 99 ? "99+" : selectedCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {title && (
          <h1 className="sm:hidden text-2xl font-bold text-slate-800 mb-4">
            {title}
          </h1>
        )}
        {children}
      </main>

      <SelectedListDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
