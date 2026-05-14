"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Phone, ChevronDown, Car, Heart } from "lucide-react";
import Flag from "@/components/Flag";
import { useFavoris } from "@/hooks/useFavoris";
import WhatsAppFlottant from "@/components/public/WhatsAppFlottant";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logo, setLogo] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("Cartago Motors");
  const { count: favorisCount } = useFavoris();

  useEffect(() => {
    fetch("/api/public/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.company_logo) setLogo(d.company_logo);
        if (d.company_name) setCompanyName(d.company_name);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-dark border-b border-white/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo - gauche */}
            <Link href="/" className="flex-shrink-0">
              {logo ? (
                <img src={logo} alt={companyName} className="h-28 w-auto object-contain" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center">
                  <Car size={20} className="text-black" strokeWidth={2.5} />
                </div>
              )}
            </Link>

            {/* Desktop nav - centre */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-carbon-300 hover:text-white transition-colors text-sm font-medium">
                Accueil
              </Link>
              <Link href="/catalogue" className="text-carbon-300 hover:text-white transition-colors text-sm font-medium">
                Catalogue
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-1 text-carbon-300 hover:text-white transition-colors text-sm font-medium">
                  Destinations <ChevronDown size={14} />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 glass-dark rounded-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-white/10">
                  {["Tunisie", "Algérie", "Maroc"].map((p) => (
                    <Link key={p} href={`/catalogue?pays=${p}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-carbon-300 hover:text-white hover:bg-white/5 text-sm transition-colors">
                      <Flag pays={p} size={14} /> {p}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/contact" className="text-carbon-300 hover:text-white transition-colors text-sm font-medium">
                Contact
              </Link>
            </div>

            {/* CTA - droite */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/favoris" className="relative w-9 h-9 flex items-center justify-center text-carbon-300 hover:text-white transition-colors">
                <Heart size={18} />
                {favorisCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    {favorisCount > 9 ? "9+" : favorisCount}
                  </span>
                )}
              </Link>
              <a href="tel:+33123456789" className="flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors">
                <Phone size={16} />
                +33 6 68 89 12 20
              </a>
              <Link href="/contact" className="btn-gold text-sm px-5 py-2.5">
                Demander un devis
              </Link>
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setOpen(!open)} className="md:hidden text-white p-2">
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden glass-dark border-t border-white/10 mt-2">
            <div className="px-4 py-4 flex flex-col gap-2">
              {[
                ["/", "Accueil"],
                ["/catalogue", "Catalogue"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-lg text-carbon-300 hover:text-white hover:bg-white/5 font-medium transition-colors"
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="btn-gold text-center mt-2"
              >
                Demander un devis
              </Link>
            </div>
          </div>
        )}
      </nav>
      <WhatsAppFlottant />
    </>
  );
}
