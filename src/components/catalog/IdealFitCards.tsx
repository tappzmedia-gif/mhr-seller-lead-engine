import { cn } from '@/lib/utils';
import { DynamicIcon } from './icons';
import type { PropertyIdealFit } from '@/lib/listing-types';

interface IdealFitCardsProps {
  profiles: PropertyIdealFit[];
  className?: string;
}

export function IdealFitCards({ profiles, className }: IdealFitCardsProps) {
  if (profiles.length === 0) return null;

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3', className)}>
      {profiles.map(profile => (
        <div
          key={profile.id}
          className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0">
            <DynamicIcon name={profile.iconName} className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-slate-800 leading-tight">{profile.label}</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{profile.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
