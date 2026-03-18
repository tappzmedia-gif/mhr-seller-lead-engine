import { Link, useLocation } from "wouter";
import { Building2, Phone, Facebook, Instagram, Twitter, Linkedin, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { getBranding } from "@/store/branding-store";
import { getContactSettings } from "@/store/contact-store";
import { cn } from "@/lib/utils";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [branding, setBranding] = useState(getBranding);
  const [contact, setContact] = useState(getContactSettings);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleBranding = () => setBranding(getBranding());
    const handleContact = () => setContact(getContactSettings());
    window.addEventListener("branding-updated", handleBranding);
    window.addEventListener("contact-updated", handleContact);
    return () => {
      window.removeEventListener("branding-updated", handleBranding);
      window.removeEventListener("contact-updated", handleContact);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/catalogo", label: "Propiedades" },
    { href: "/about", label: "Sobre Nosotros" },
    { href: "/contact", label: "Contacto" },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-primary hover:opacity-90 transition-opacity">
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt={branding.systemName} className="h-12 w-12 rounded-lg object-contain" />
            ) : (
              <Building2 className="h-10 w-10" />
            )}
            <span className="font-display font-bold text-2xl tracking-tight">{branding.systemName}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-semibold transition-colors",
                  location === link.href
                    ? "text-primary"
                    : "text-slate-700 hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="text-sm font-semibold text-slate-700 hover:text-primary transition-colors"
            >
              Iniciar Sesión
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Phone className="h-4 w-4" />
              {contact.phoneMetro}
            </div>
            <Link href="/formulario" className="hidden sm:inline-flex px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              {contact.ctaLabel || "Vender mi propiedad"}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
            <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-sm font-semibold transition-colors",
                    location === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin/login"
                className="block px-4 py-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/formulario"
                className="block px-4 py-3 rounded-lg text-sm font-semibold text-center bg-primary text-white mt-2"
              >
                {contact.ctaLabel || "Vender mi propiedad"}
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-3 text-white mb-5">
                {branding.logoUrl ? (
                  <img
                    src={branding.logoUrl}
                    alt={branding.systemName}
                    className="h-10 w-10 rounded-lg object-contain brightness-0 invert"
                  />
                ) : (
                  <Building2 className="h-8 w-8" />
                )}
                <span className="font-display font-bold text-xl">{branding.systemName}</span>
              </div>
              <p className="text-sm opacity-80 max-w-xs leading-relaxed">
                El sistema de compra directa de propiedades más confiable en Puerto Rico.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <a href={contact.socialLinks?.facebook || "#"} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href={contact.socialLinks?.instagram || "#"} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all">
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-5">Navegación</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
                <li><Link href="/catalogo" className="hover:text-white transition-colors">Catálogo de Propiedades</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Sobre Nosotros</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contacto</Link></li>
                <li><Link href="/formulario" className="hover:text-white transition-colors">Evaluar mi propiedad</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-5">Contacto</h4>
              <ul className="space-y-3 text-sm">
                <li>Metro: {contact.phoneMetro}</li>
                <li>Isla: {contact.phoneIsla}</li>
                <li>Email: {contact.email}</li>
                {contact.address && <li>{contact.address}</li>}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-5">Horario</h4>
              <ul className="space-y-3 text-sm">
                <li>{contact.businessHours}</li>
                {contact.whatsapp && (
                  <li>
                    <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      WhatsApp directo
                    </a>
                  </li>
                )}
              </ul>
              <div className="mt-6 space-y-2 text-sm">
                <a href="#" className="block hover:text-white transition-colors">Términos de servicio</a>
                <a href="#" className="block hover:text-white transition-colors">Política de privacidad</a>
              </div>
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm opacity-60">
            <p>&copy; {new Date().getFullYear()} {branding.systemName}. Todos los derechos reservados.</p>
            <Link href="/admin/login" className="hover:text-white transition-colors">Admin Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
