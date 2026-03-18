import { cn } from '@/lib/utils';
import { DynamicIcon } from './icons';
import { Star } from 'lucide-react';
import type { PropertyAmenity } from '@/lib/listing-types';
import { getAttributeById } from '@/lib/attribute-library';

interface PropertyHighlightsProps {
  amenities: PropertyAmenity[];
  className?: string;
  maxItems?: number;
}

export function PropertyHighlights({ amenities, className, maxItems }: PropertyHighlightsProps) {
  let featured = amenities
    .filter(a => a.active && a.featured)
    .sort((a, b) => a.order - b.order);

  if (maxItems) featured = featured.slice(0, maxItems);

  if (featured.length === 0) return null;

  return (
    <div className={cn('flex items-center gap-2 overflow-x-auto pb-1', className)}>
      <Star className="h-4 w-4 text-amber-500 shrink-0 fill-amber-500" />
      {featured.map(amenity => {
        const attr = getAttributeById(amenity.attributeId);
        const label = attr?.label || amenity.customLabel;
        const iconName = attr?.iconName || amenity.customIcon || 'Star';
        if (!label) return null;
        return (
          <span
            key={amenity.id}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold whitespace-nowrap"
          >
            <DynamicIcon name={iconName} className="h-3.5 w-3.5" />
            {label}
          </span>
        );
      })}
    </div>
  );
}
