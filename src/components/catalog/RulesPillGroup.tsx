import { cn } from '@/lib/utils';
import { ShieldAlert, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import type { PropertyRule, PropertyCondition } from '@/lib/listing-types';

interface RulesPillGroupProps {
  rules: PropertyRule[];
  conditions: PropertyCondition[];
  className?: string;
}

const ruleColors: Record<PropertyRule['type'], { bg: string; text: string; border: string }> = {
  allowed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  restricted: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  conditional: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  info: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
};

const conditionColors: Record<PropertyCondition['type'], { bg: string; text: string; border: string; icon: typeof Info }> = {
  requirement: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: ShieldAlert },
  warning: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: AlertTriangle },
  info: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', icon: Info },
};

function RuleIcon({ type }: { type: PropertyRule['type'] }) {
  switch (type) {
    case 'allowed': return <CheckCircle className="h-3.5 w-3.5" />;
    case 'restricted': return <ShieldAlert className="h-3.5 w-3.5" />;
    case 'conditional': return <AlertTriangle className="h-3.5 w-3.5" />;
    case 'info': return <Info className="h-3.5 w-3.5" />;
  }
}

export function RulesPillGroup({ rules, conditions, className }: RulesPillGroupProps) {
  if (rules.length === 0 && conditions.length === 0) return null;

  return (
    <div className={cn('space-y-4', className)}>
      {rules.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Reglas</h4>
          <div className="flex flex-wrap gap-2">
            {rules.map(rule => {
              const colors = ruleColors[rule.type];
              return (
                <span
                  key={rule.id}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border',
                    colors.bg, colors.text, colors.border
                  )}
                >
                  <RuleIcon type={rule.type} />
                  {rule.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {conditions.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Condiciones</h4>
          <div className="space-y-2">
            {conditions.map(cond => {
              const colors = conditionColors[cond.type];
              const CondIcon = colors.icon;
              return (
                <div
                  key={cond.id}
                  className={cn(
                    'flex items-start gap-2.5 p-3 rounded-lg border',
                    colors.bg, colors.border
                  )}
                >
                  <CondIcon className={cn('h-4 w-4 mt-0.5 shrink-0', colors.text)} />
                  <div>
                    <span className={cn('text-sm font-medium', colors.text)}>{cond.label}</span>
                    {cond.description && (
                      <p className="text-xs text-slate-500 mt-0.5">{cond.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
