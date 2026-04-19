"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FolderOpen, 
  Settings, 
  ChevronLeft, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { logout } from "@/lib/actions/auth-actions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/designs", label: "Designs", icon: FolderOpen },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#090A11] text-white">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#0A0B14] px-4 lg:hidden">
        <Link href="/admin" className="text-xl font-bold text-[#E9F284]">
          BUILD.DESIGN
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="rounded-lg p-2 text-white/70 hover:bg-white/5 hover:text-white"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 border-r border-white/10 bg-[#0A0B14] transition-transform duration-300 lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex h-16 items-center justify-center border-b border-white/10">
          <Link href="/admin" className="text-xl font-bold text-[#E9F284]">
            BUILD.DESIGN
          </Link>
        </div>

        <nav className="flex h-[calc(100vh-4rem)] flex-col space-y-1 p-4">
          <div className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-[#E9F284]/10 text-[#E9F284]" 
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="space-y-2 border-t border-white/5 pt-4 pb-4">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
            >
              <ChevronLeft size={18} />
              Back to Site
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-400/10"
              >
                <LogOut size={18} />
                Logout
              </button>
            </form>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen pt-16 lg:ml-64 lg:pt-0">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
