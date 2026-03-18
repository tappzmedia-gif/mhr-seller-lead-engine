import { useState, useRef, useCallback, useSyncExternalStore, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Building2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPublicListings, getHomeCatalogConfig } from '@/store/listings-store';
import { PropertyCard } from './PropertyCard';
import { QuickViewModal } from './QuickViewModal';
import type { PublicListing, CarouselBlockConfig, HomeCatalogConfig } from '@/lib/listing-types';

function useListings() {
  const subscribe = useCallback((cb: () => void) => {
    window.addEventListener('listings-updated', cb);
    return () => window.removeEventListener('listings-updated', cb);
  }, []);
  return useSyncExternalStore(subscribe, getPublicListings, getPublicListings);
}

function useHomeCatalogConfig() {
  const subscribe = useCallback((cb: () => void) => {
    window.addEventListener('home-catalog-config-updated', cb);
    return () => window.removeEventListener('home-catalog-config-updated', cb);
  }, []);
  return useSyncExternalStore(subscribe, getHomeCatalogConfig, getHomeCatalogConfig);
}

function filterListings(
  listings: PublicListing[],
  operationType: 'sale' | 'rental',
  blockConfig: CarouselBlockConfig
): PublicListing[] {
  let filtered = listings.filter(l => l.status === 'active' && l.operationType === operationType);

  if (blockConfig.sourceLogic === 'featured') {
    filtered = filtered.filter(l => l.featured);
  } else if (blockConfig.sourceLogic === 'latest') {
    filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return filtered.slice(0, blockConfig.maxCards);
}

function ListingCarousel({
  listings,
  blockConfig,
  config,
  onQuickView,
}: {
  listings: PublicListing[];
  blockConfig: CarouselBlockConfig;
  config: HomeCatalogConfig;
  onQuickView: (listing: PublicListing) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', checkScroll); ro.disconnect(); };
  }, [checkScroll, listings.length]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 316;
    el.scrollBy({ left: direction === 'right' ? cardWidth * 2 : -cardWidth * 2, behavior: 'smooth' });
  };

  if (listings.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
        <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm text-slate-500 font-medium">No hay propiedades disponibles en esta categoría</p>
      </div>
    );
  }

  return (
    <div className="relative group/carousel">
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute -left-3 sm:left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-primary hover:border-primary/30 transition-all opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-2 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {listings.map(listing => (
          <PropertyCard
            key={listing.id}
            listing={listing}
            displayConfig={config.cardDisplay}
            onQuickView={blockConfig.quickViewEnabled ? onQuickView : undefined}
          />
        ))}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute -right-3 sm:right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-primary hover:border-primary/30 transition-all opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

function CarouselBlock({
  operationType,
  listings,
  blockConfig,
  config,
  onQuickView,
}: {
  operationType: 'sale' | 'rental';
  listings: PublicListing[];
  blockConfig: CarouselBlockConfig;
  config: HomeCatalogConfig;
  onQuickView: (listing: PublicListing) => void;
}) {
  if (!blockConfig.visible) return null;

  const filtered = filterListings(listings, operationType, blockConfig);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-end justify-between mb-5">
        <div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900">{blockConfig.title}</h3>
          {blockConfig.subtitle && (
            <p className="text-sm text-slate-500 mt-1">{blockConfig.subtitle}</p>
          )}
        </div>
        <Link
          href={blockConfig.ctaDestination}
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group/cta whitespace-nowrap"
        >
          {blockConfig.ctaLabel}
          <ArrowRight className="h-4 w-4 group-hover/cta:translate-x-1 transition-transform" />
        </Link>
      </div>

      <ListingCarousel
        listings={filtered}
        blockConfig={blockConfig}
        config={config}
        onQuickView={onQuickView}
      />

      <div className="sm:hidden mt-4 text-center">
        <Link
          href={blockConfig.ctaDestination}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-colors"
        >
          {blockConfig.ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}

export function HomeCatalogSection() {
  const allListings = useListings();
  const config = useHomeCatalogConfig();
  const [quickViewListing, setQuickViewListing] = useState<PublicListing | null>(null);

  if (!config.enabled) return null;

  const bgClass = {
    white: 'bg-white',
    light: 'bg-slate-50',
    dark: 'bg-slate-900 text-white',
  }[config.backgroundVariant];

  return (
    <>
      <section className={cn('py-20 sm:py-24', bgClass)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className={cn(
              'text-3xl md:text-4xl font-display font-bold mb-4',
              config.backgroundVariant === 'dark' ? 'text-white' : 'text-slate-900'
            )}>
              {config.sectionTitle}
            </h2>
            <p className={cn(
              'text-lg',
              config.backgroundVariant === 'dark' ? 'text-slate-300' : 'text-slate-600'
            )}>
              {config.sectionSubtitle}
            </p>
            {config.sectionMicrocopy && (
              <p className={cn(
                'text-sm mt-2',
                config.backgroundVariant === 'dark' ? 'text-slate-400' : 'text-slate-400'
              )}>
                {config.sectionMicrocopy}
              </p>
            )}
          </motion.div>

          <div className="space-y-14">
            <CarouselBlock
              operationType="sale"
              listings={allListings}
              blockConfig={config.purchaseCarousel}
              config={config}
              onQuickView={setQuickViewListing}
            />

            <CarouselBlock
              operationType="rental"
              listings={allListings}
              blockConfig={config.rentalCarousel}
              config={config}
              onQuickView={setQuickViewListing}
            />
          </div>
        </div>
      </section>

      {quickViewListing && config.quickView.enabled && (
        <QuickViewModal
          listing={quickViewListing}
          config={config.quickView}
          onClose={() => setQuickViewListing(null)}
        />
      )}
    </>
  );
}
