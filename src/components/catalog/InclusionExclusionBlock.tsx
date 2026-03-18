import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { DynamicIcon } from './icons';
import type { PropertyInclusion, PropertyExclusion } from '@/lib/listing-types';

interface InclusionExclusionBlockProps {
  inclusions: PropertyInclusion[];
  exclusions: PropertyExclusion[];
  className?: string;
}

export function InclusionExclusionBlock({ inclusions, exclusions, className }: InclusionExclusionBlockProps) {
  if (inclusions.length === 0 && exclusions.length === 0) return null;

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-6', className)}>
      {inclusions.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-2">
            <Check className="h-4 w-4" />
            Incluye
          </h4>
          <div className="space-y-2">
            {inclusions.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                <div className="flex items-center justify-center w-7 h-7 rounded-md bg-emerald-100 text-emerald-600 shrink-0">
                  <DynamicIcon name={item.iconName} className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm text-emerald-800 font-medium">{item.label}</span>
                <Check className="h-4 w-4 text-emerald-500 ml-auto shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {exclusions.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
            <X className="h-4 w-4" />
            No incluye
          </h4>
          <div className="space-y-2">
            {exclusions.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-red-50 border border-red-100">
                <div className="flex items-center justify-center w-7 h-7 rounded-md bg-red-100 text-red-600 shrink-0">
                  <DynamicIcon name={item.iconName} className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm text-red-800 font-medium">{item.label}</span>
                <X className="h-4 w-4 text-red-400 ml-auto shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
