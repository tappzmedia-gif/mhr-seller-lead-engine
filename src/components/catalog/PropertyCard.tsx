import { Building2, MapPin, BedDouble, Bath, Car, Maximize, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PropertyHighlights } from '@/components/catalog/PropertyHighlights';
import type { PublicListing, CardDisplayConfig } from '@/lib/listing-types';

interface PropertyCardProps {
  listing: PublicListing;
  displayConfig: CardDisplayConfig;
  onQuickView?: (listing: PublicListing) => void;
  className?: string;
}

export function PropertyCard({ listing, displayConfig, onQuickView, className }: PropertyCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm',
        'hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group',
        'flex flex-col w-[280px] sm:w-[300px] shrink-0 snap-start',
        className
      )}
      onClick={() => onQuickView?.(listing)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onQuickView?.(listing); }}
    >
      {displayConfig.showImage && (
        <div className="relative aspect-[16/10] bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
          {listing.photos[0] && !listing.photos[0].startsWith('/placeholder') ? (
            <img
              src={listing.photos[0]}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
              <Building2 className="h-12 w-12 opacity-30" />
            </div>
          )}

          {displayConfig.showBadges && (
            <div className="absolute top-2.5 left-2.5 flex gap-1.5">
              <span className={cn(
                'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                listing.operationType === 'sale'
                  ? 'bg-blue-600 text-white'
                  : 'bg-emerald-600 text-white'
              )}>
                {listing.operationType === 'sale' ? 'Venta' : 'Alquiler'}
              </span>
              {listing.featured && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white">
                  Destacada
                </span>
              )}
            </div>
          )}

          {displayConfig.showPrice && (
            <div className="absolute bottom-2.5 right-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-black/70 text-white font-bold text-sm backdrop-blur-sm">
                {listing.priceLabel}
              </span>
            </div>
          )}

          {displayConfig.showQuickViewCTA && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="px-3 py-1.5 rounded-full bg-white/95 text-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                <Eye className="h-3.5 w-3.5" /> Vista rápida
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-800 text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
          {listing.title}
        </h3>

        {displayConfig.showLocation && (
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-2.5">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{listing.sector}, {listing.municipality}</span>
          </div>
        )}

        {displayConfig.showStats && (
          <div className="flex items-center gap-3 text-[11px] text-slate-600 mb-3">
            {listing.bedrooms !== undefined && (
              <span className="flex items-center gap-0.5">
                <BedDouble className="h-3 w-3" /> {listing.bedrooms}
              </span>
            )}
            {listing.bathrooms !== undefined && (
              <span className="flex items-center gap-0.5">
                <Bath className="h-3 w-3" /> {listing.bathrooms}
              </span>
            )}
            {listing.parkingSpaces !== undefined && listing.parkingSpaces > 0 && (
              <span className="flex items-center gap-0.5">
                <Car className="h-3 w-3" /> {listing.parkingSpaces}
              </span>
            )}
            <span className="flex items-center gap-0.5">
              <Maximize className="h-3 w-3" /> {listing.area.toLocaleString()} {listing.areaUnit}
            </span>
          </div>
        )}

        {displayConfig.showHighlights && (
          <div className="mt-auto">
            <PropertyHighlights amenities={listing.amenities} maxItems={3} />
          </div>
        )}

        {displayConfig.showPropertyType && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{listing.propertyType}</span>
            {!displayConfig.showPrice && (
              <span className="text-xs font-bold text-primary">{listing.priceLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
