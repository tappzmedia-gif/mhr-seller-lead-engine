import { Link } from 'wouter';
import { Building2, MapPin, BedDouble, Bath, Car, Maximize, ArrowRight, Search, SlidersHorizontal } from 'lucide-react';
import { useState, useSyncExternalStore, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getPublicListings } from '@/store/listings-store';
import { PropertyHighlights } from '@/components/catalog/PropertyHighlights';
import { PublicLayout } from '@/components/layouts/PublicLayout';
import type { OperationType, PropertyCategory } from '@/lib/listing-types';

function useListings() {
  const subscribe = useCallback((cb: () => void) => {
    window.addEventListener('listings-updated', cb);
    return () => window.removeEventListener('listings-updated', cb);
  }, []);
  return useSyncExternalStore(subscribe, getPublicListings, getPublicListings);
}

export default function Catalog() {
  const listings = useListings();
  const [search, setSearch] = useState('');
  const [opFilter, setOpFilter] = useState<OperationType | 'all'>('all');
  const [catFilter, setCatFilter] = useState<PropertyCategory | 'all'>('all');

  const filtered = listings.filter(l => {
    if (l.status !== 'active') return false;
    if (opFilter !== 'all' && l.operationType !== opFilter) return false;
    if (catFilter !== 'all' && l.propertyCategory !== catFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return l.title.toLowerCase().includes(q) || l.municipality.toLowerCase().includes(q) || l.sector.toLowerCase().includes(q) || l.propertyType.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-slate-900">Catálogo de Propiedades</h1>
          <p className="text-slate-500 mt-2">Explore nuestra selección de propiedades disponibles en Puerto Rico.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por título, municipio o tipo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={opFilter}
              onChange={e => setOpFilter(e.target.value as OperationType | 'all')}
              className="px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="all">Todas las operaciones</option>
              <option value="sale">Venta</option>
              <option value="rental">Alquiler</option>
            </select>
            <select
              value={catFilter}
              onChange={e => setCatFilter(e.target.value as PropertyCategory | 'all')}
              className="px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="all">Todas las categorías</option>
              <option value="residential">Residencial</option>
              <option value="commercial">Comercial</option>
              <option value="land">Terreno</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <SlidersHorizontal className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600">No se encontraron propiedades</h3>
            <p className="text-sm text-slate-400 mt-1">Intente ajustar los filtros de búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((listing, i) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link href={`/catalogo/${listing.id}`}>
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                    <div className="relative h-52 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                      {listing.photos[0] && !listing.photos[0].startsWith('/placeholder') ? (
                        <img
                          src={listing.photos[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                          <Building2 className="h-16 w-16 opacity-30" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={cn(
                          'px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide',
                          listing.operationType === 'sale'
                            ? 'bg-blue-600 text-white'
                            : 'bg-emerald-600 text-white'
                        )}>
                          {listing.operationType === 'sale' ? 'Venta' : 'Alquiler'}
                        </span>
                        {listing.featured && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-500 text-white">
                            Destacada
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <span className="px-3 py-1.5 rounded-lg bg-black/70 text-white font-bold text-sm backdrop-blur-sm">
                          {listing.priceLabel}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-slate-800 text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {listing.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>{listing.sector}, {listing.municipality}</span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{listing.description}</p>

                      <div className="flex items-center gap-4 text-xs text-slate-600 mb-4">
                        {listing.bedrooms !== undefined && (
                          <span className="flex items-center gap-1">
                            <BedDouble className="h-3.5 w-3.5" /> {listing.bedrooms} hab.
                          </span>
                        )}
                        {listing.bathrooms !== undefined && (
                          <span className="flex items-center gap-1">
                            <Bath className="h-3.5 w-3.5" /> {listing.bathrooms} baños
                          </span>
                        )}
                        {listing.parkingSpaces !== undefined && listing.parkingSpaces > 0 && (
                          <span className="flex items-center gap-1">
                            <Car className="h-3.5 w-3.5" /> {listing.parkingSpaces}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Maximize className="h-3.5 w-3.5" /> {listing.area.toLocaleString()} {listing.areaUnit}
                        </span>
                      </div>

                      <PropertyHighlights amenities={listing.amenities} />

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{listing.propertyType}</span>
                        <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                          Ver detalles <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
