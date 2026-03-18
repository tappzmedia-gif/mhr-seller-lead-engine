import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Send, CheckCircle, Loader2 } from 'lucide-react';
import type { DynamicInquiryFormConfig, InquiryFormField } from '@/lib/listing-types';

interface InquiryFormEngineProps {
  config: DynamicInquiryFormConfig;
  className?: string;
}

function FormField({ field, value, onChange }: { field: InquiryFormField; value: string; onChange: (v: string) => void }) {
  const baseInputClasses = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all";

  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          className={cn(baseInputClasses, 'min-h-[80px] resize-none')}
          placeholder={field.placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          required={field.required}
        />
      );
    case 'select':
      return (
        <select
          className={baseInputClasses}
          value={value}
          onChange={e => onChange(e.target.value)}
          required={field.required}
        >
          <option value="">Seleccionar...</option>
          {field.options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    case 'checkbox':
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-slate-300 text-primary focus:ring-primary"
            checked={value === 'true'}
            onChange={e => onChange(e.target.checked ? 'true' : 'false')}
          />
          <span className="text-sm text-slate-700">{field.placeholder || field.label}</span>
        </label>
      );
    default:
      return (
        <input
          type={field.type === 'phone' ? 'tel' : field.type}
          className={baseInputClasses}
          placeholder={field.placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          required={field.required}
        />
      );
  }
}

export function InquiryFormEngine({ config, className }: InquiryFormEngineProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <div className={cn('text-center py-8 px-6', className)}>
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{config.successTitle}</h3>
        <p className="text-sm text-slate-500">{config.successMessage}</p>
        <button
          onClick={() => { setSubmitted(false); setFormData({}); }}
          className="mt-4 text-sm text-primary font-medium hover:underline"
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <div className={cn('', className)}>
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-800">{config.heading}</h3>
        <p className="text-sm text-slate-500 mt-1">{config.subheading}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {config.fields.map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {field.label}
              {field.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <FormField
              field={field}
              value={formData[field.name] || ''}
              onChange={v => setFormData(prev => ({ ...prev, [field.name]: v }))}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
          ) : (
            <><Send className="h-4 w-4" /> {config.submitLabel}</>
          )}
        </button>
      </form>
    </div>
  );
}
