import { useState } from 'react';
import { Link } from 'wouter';
import {
  X, Building2, MapPin, BedDouble, Bath, Car, Maximize, Calendar,
  ChevronLeft, ChevronRight, ArrowRight, Check, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DynamicIcon } from '@/components/catalog/icons';
import { PropertyHighlights } from '@/components/catalog/PropertyHighlights';
import { getAttributeById } from '@/lib/attribute-library';
import type { PublicListing, QuickViewConfig } from '@/lib/listing-types';

interface QuickViewModalProps {
  listing: PublicListing;
  config: QuickViewConfig;
  onClose: () => void;
  onInquiry?: (listing: PublicListing) => void;
}

export function QuickViewModal({ listing, config, onClose, onInquiry }: QuickViewModalProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const hasPhotos = listing.photos.length > 0 && !listing.photos[0]?.startsWith('/placeholder');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {config.showGallery && (
          <div className="relative aspect-[16/9] bg-gradient-to-br from-slate-200 to-slate-300 shrink-0">
            {hasPhotos ? (
              <img
                src={listing.photos[photoIndex]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                <Building2 className="h-20 w-20 opacity-20" />
              </div>
            )}

            <div className="absolute top-3 left-3 flex gap-1.5">
              <span className={cn(
                'px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide',
                listing.operationType === 'sale' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
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
              <span className="px-3 py-1.5 rounded-lg bg-black/70 text-white font-bold text-lg backdrop-blur-sm">
                {listing.priceLabel}
              </span>
            </div>

            {listing.photos.length > 1 && (
              <>
                <button
                  onClick={() => setPhotoIndex(i => (i - 1 + listing.photos.length) % listing.photos.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPhotoIndex(i => (i + 1) % listing.photos.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                  {listing.photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIndex(i)}
                      className={cn('w-1.5 h-1.5 rounded-full transition-all', i === photoIndex ? 'bg-white w-3' : 'bg-white/50')}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-5">
          <div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 leading-tight mb-1.5">
              {listing.title}
            </h2>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>{listing.sector}, {listing.municipality}</span>
            </div>
            <PropertyHighlights amenities={listing.amenities} />
          </div>

          {config.showSpecs && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {listing.bedrooms !== undefined && (
                <SpecCard icon={<BedDouble className="h-4 w-4" />} label="Habitaciones" value={String(listing.bedrooms)} />
              )}
              {listing.bathrooms !== undefined && (
                <SpecCard icon={<Bath className="h-4 w-4" />} label="Baños" value={String(listing.bathrooms)} />
              )}
              {listing.parkingSpaces !== undefined && listing.parkingSpaces > 0 && (
                <SpecCard icon={<Car className="h-4 w-4" />} label="Parking" value={String(listing.parkingSpaces)} />
              )}
              <SpecCard icon={<Maximize className="h-4 w-4" />} label="Tamaño" value={`${listing.area.toLocaleString()} ${listing.areaUnit}`} />
              {listing.yearBuilt && (
                <SpecCard icon={<Calendar className="h-4 w-4" />} label="Año" value={String(listing.yearBuilt)} />
              )}
            </div>
          )}

          {config.showDescription && listing.description && (
            <div>
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{listing.description}</p>
            </div>
          )}

          {config.showInclusions && (listing.inclusions.length > 0 || listing.utilities.length > 0) && (
            <div className="space-y-2">
              {listing.utilities.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {listing.utilities.map(util => {
                    const attr = getAttributeById(util.attributeId);
                    return (
                      <span key={util.id} className={cn(
                        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium',
                        util.included ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-500 border border-slate-200'
                      )}>
                        <DynamicIcon name={attr?.iconName || 'Zap'} className="h-3 w-3" />
                        {attr?.label || util.attributeId}
                        {util.included && <Check className="h-2.5 w-2.5" />}
                      </span>
                    );
                  })}
                </div>
              )}
              {listing.inclusions.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {listing.inclusions.slice(0, 6).map(inc => (
                    <span key={inc.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <DynamicIcon name={inc.iconName} className="h-3 w-3" />
                      {inc.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {config.showCTAs && (
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <Link
                href={`/catalogo/${listing.id}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                onClick={onClose}
              >
                {config.primaryCTALabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => { onInquiry?.(listing); onClose(); }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-colors"
              >
                {config.secondaryCTALabel}
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SpecCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
      <div className="text-slate-400 flex justify-center mb-1">{icon}</div>
      <div className="text-base font-bold text-slate-800">{value}</div>
      <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">{label}</div>
    </div>
  );
}
