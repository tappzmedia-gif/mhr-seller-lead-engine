import { cn } from '@/lib/utils';
import { DynamicIcon } from './icons';
import type { PropertyAmenity } from '@/lib/listing-types';
import { getAttributeById } from '@/lib/attribute-library';

interface AttributeIconGridProps {
  amenities: PropertyAmenity[];
  className?: string;
}

export function AttributeIconGrid({ amenities, className }: AttributeIconGridProps) {
  const activeAmenities = amenities
    .filter(a => a.active)
    .sort((a, b) => a.order - b.order);

  if (activeAmenities.length === 0) return null;

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3', className)}>
      {activeAmenities.map(amenity => {
        const attr = getAttributeById(amenity.attributeId);
        const label = attr?.label || amenity.customLabel;
        const iconName = attr?.iconName || amenity.customIcon || 'Star';
        if (!label) return null;
        return (
          <div
            key={amenity.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-xl border transition-all',
              amenity.featured
                ? 'bg-primary/5 border-primary/20 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'
            )}
          >
            <div className={cn(
              'flex items-center justify-center w-9 h-9 rounded-lg shrink-0',
              amenity.featured
                ? 'bg-primary/10 text-primary'
                : 'bg-slate-100 text-slate-600'
            )}>
              <DynamicIcon name={iconName} className="h-4.5 w-4.5" />
            </div>
            <span className={cn(
              'text-sm font-medium leading-tight',
              amenity.featured ? 'text-primary' : 'text-slate-700'
            )}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
