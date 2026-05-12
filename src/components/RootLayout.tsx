import { useEffect, useState } from "react";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
import { queryClient } from "../lib/queryClient";
import { useConfig } from "../hooks/useConfig";
import { TABS, TAB_TITLES } from "../lib/tabs";
import { Icon } from "../lib/icons";

function SideMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (path: string) => {
    navigate({ to: path });
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${open ? "visible" : "invisible"}`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`absolute top-0 left-0 h-full w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="bg-[#111827] text-white px-5 py-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] tracking-widest text-white/30 uppercase mb-0.5">
              ФИНАНСЫ
            </div>
            <div className="text-base font-bold">Меню</div>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3">
          {TABS.map((t) => {
            const active = pathname === t.path;
            return (
              <button
                key={t.path}
                onClick={() => go(t.path)}
                className={`w-full flex items-center gap-3.5 px-5 py-3.5 text-left transition-colors ${
                  active
                    ? "bg-stone-100 text-[#111827] font-semibold"
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
                }`}
              >
                {active && (
                  <span className="absolute left-0 h-8 w-1 bg-[#111827] rounded-r-full" />
                )}
                <Icon name={t.icon} size={18} />
                <span className="text-sm">{t.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function Header({ onMenuOpen }: { onMenuOpen: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isSaving } = useConfig();

  return (
    <header className="bg-[#111827] text-white px-5 sticky top-0 z-10">
      <div className="max-w-lg mx-auto py-4 flex items-center gap-3">
        <button
          onClick={onMenuOpen}
          className="text-white/60 hover:text-white transition-colors shrink-0"
        >
          <Menu size={22} />
        </button>
        <div className="flex-1">
          <div className="text-lg font-bold leading-tight">
            {TAB_TITLES[pathname] ?? "Финансы"}
          </div>
        </div>
        {isSaving && (
          <div className="flex items-center gap-1.5 text-white/40 text-xs shrink-0">
            <div className="w-3 h-3 border border-white/30 border-t-white/60 rounded-full animate-spin" />
            Сохраняю...
          </div>
        )}
      </div>
    </header>
  );
}

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-stone-100 flex flex-col">
      <Header onMenuOpen={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout />
    </QueryClientProvider>
  );
}
