"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Car, LogOut, Menu, ChevronRight } from "lucide-react";

const navItems = [
  { href: "/admin/voitures", icon: Car, label: "Voitures" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logo, setLogo] = useState("");
  const [companyName, setCompanyName] = useState("Cartago Motors");

  useEffect(() => {
    fetch("/api/public/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.company_logo) setLogo(d.company_logo);
        if (d.company_name) setCompanyName(d.company_name);
      })
      .catch(() => {});
  }, []);

  if (pathname === "/admin/login") return <>{children}</>;

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-carbon-950 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-carbon-950 border-r border-carbon-900 flex flex-col transition-transform duration-300
        lg:translate-x-0 lg:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-carbon-900">
          <div className="flex items-center gap-3">
            {logo ? (
              <img
                src={logo}
                alt={companyName}
                className="h-24 w-auto object-contain"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center flex-shrink-0">
                <Car size={32} className="text-black" strokeWidth={2.5} />
              </div>
            )}
            <div>
              <div className="text-gold-500 text-s tracking-wider">
                Administration
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`sidebar-link ${active ? "active" : ""}`}
              >
                <Icon size={18} />
                {label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-carbon-900">
          <Link href="/" target="_blank" className="sidebar-link text-xs mb-2">
            <span className="text-xs">🌐</span> Voir le site public
          </Link>
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-400/5"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-carbon-950 border-b border-carbon-900 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-carbon-400 hover:text-white transition-colors"
          >
            <Menu size={22} />
          </button>
          <div className="hidden lg:block">
            <div className="text-carbon-400 text-sm">
              {navItems.find((n) => pathname.startsWith(n.href))?.label ||
                "Administration"}
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="w-9 h-9 bg-gradient-to-br from-gold-600 to-gold-400 rounded-xl flex items-center justify-center">
              <span className="text-black font-bold text-sm">A</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
