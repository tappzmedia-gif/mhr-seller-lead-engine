import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Button, Input, Card } from "@/components/ui-components";
import { cn } from "@/lib/utils";
import { getBranding } from "@/store/branding-store";
import { formsService } from "@/lib/services/formsService";
import type { FormDefinition, FormField, FormFieldType } from "@/lib/operations-types";
import { Loader2, CheckCircle, Upload, Send } from "lucide-react";
import { BRAND } from "@/lib/mock-data";

export default function FormLanding() {
  const [, params] = useRoute("/formulario/:id");
  const [form, setForm] = useState<FormDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const branding = getBranding();

  useEffect(() => {
    if (params?.id) {
      formsService.getById(params.id).then(f => {
        if (f) {
          setForm(f);
          const initialValues: Record<string, any> = {};
          f.fields.filter(ff => ff.active).forEach(ff => {
            initialValues[ff.id] = ff.type === 'multi-select' ? [] : '';
          });
          setFormValues(initialValues);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      });
    }
  }, [params?.id]);

  const updateValue = (fieldId: string, value: any) => {
    setFormValues(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const isValid = () => {
    if (!form) return false;
    return form.fields
      .filter(f => f.active && f.required)
      .every(f => {
        const val = formValues[f.id];
        if (Array.isArray(val)) return val.length > 0;
        return val && val.toString().trim() !== '';
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: branding.primaryColor + '10' }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: branding.primaryColor }} />
      </div>
    );
  }

  if (notFound || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Formulario no encontrado</h1>
          <p className="text-slate-500">El formulario que buscas no existe o ha sido eliminado.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: branding.primaryColor + '08' }}>
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: branding.primaryColor + '15' }}>
            <CheckCircle className="h-10 w-10" style={{ color: branding.primaryColor }} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Formulario Enviado</h2>
          <p className="text-slate-500 mb-6">Gracias por completar el formulario. Nos pondremos en contacto contigo pronto.</p>
          <p className="text-xs text-slate-400">{branding.systemName}</p>
        </div>
      </div>
    );
  }

  const activeFields = form.fields.filter(f => f.active).sort((a, b) => a.order - b.order);
  const landingTitle = form.landingTitle || '';
  const landingInstructions = form.landingInstructions || '';
  const landingBgColor = form.landingBgColor || '';
  const bgColor = landingBgColor || (branding.primaryColor + '08');
  const ringStyle: React.CSSProperties = { ['--tw-ring-color' as string]: branding.primaryColor } as React.CSSProperties;

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: bgColor }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          {branding.logoUrl && (
            <img src={branding.logoUrl} alt={branding.systemName} className="h-12 mx-auto mb-4 object-contain" />
          )}
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: branding.fontFamily }}>
            {branding.systemName}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{branding.tagline}</p>
        </div>

        <Card className="shadow-xl border-0 overflow-hidden">
          <div className="p-1.5" style={{ backgroundColor: branding.primaryColor }} />

          <div className="p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">{landingTitle || form.name}</h2>
              {landingInstructions && <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-lg">{landingInstructions}</p>}
              {form.description && <p className="text-sm text-slate-500 mt-1">{form.description}</p>}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {activeFields.map(field => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-0.5">*</span>}
                  </label>

                  {field.type === 'text' || field.type === 'number' || field.type === 'phone' || field.type === 'email' ? (
                    <input
                      type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : field.type === 'number' ? 'number' : 'text'}
                      value={formValues[field.id] || ''}
                      onChange={e => updateValue(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      style={ringStyle}
                    />
                  ) : field.type === 'long-text' ? (
                    <textarea
                      value={formValues[field.id] || ''}
                      onChange={e => updateValue(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      style={ringStyle}
                    />
                  ) : field.type === 'dropdown' ? (
                    <select
                      value={formValues[field.id] || ''}
                      onChange={e => updateValue(field.id, e.target.value)}
                      required={field.required}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      style={ringStyle}
                    >
                      <option value="">{field.placeholder || 'Seleccionar...'}</option>
                      {field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : field.type === 'multi-select' ? (
                    <div className="space-y-1.5">
                      {field.options?.map(o => (
                        <label key={o.value} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(formValues[field.id] || []).includes(o.value)}
                            onChange={e => {
                              const current = formValues[field.id] || [];
                              updateValue(field.id, e.target.checked ? [...current, o.value] : current.filter((v: string) => v !== o.value));
                            }}
                            className="accent-primary rounded"
                            style={{ accentColor: branding.primaryColor }}
                          />
                          {o.label}
                        </label>
                      ))}
                    </div>
                  ) : field.type === 'radio' ? (
                    <div className="space-y-1.5">
                      {field.options?.map(o => (
                        <label key={o.value} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                          <input
                            type="radio"
                            name={field.id}
                            value={o.value}
                            checked={formValues[field.id] === o.value}
                            onChange={() => updateValue(field.id, o.value)}
                            style={{ accentColor: branding.primaryColor }}
                          />
                          {o.label}
                        </label>
                      ))}
                    </div>
                  ) : field.type === 'checkbox' ? (
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!formValues[field.id]}
                        onChange={e => updateValue(field.id, e.target.checked)}
                        style={{ accentColor: branding.primaryColor }}
                      />
                      {field.placeholder || field.label}
                    </label>
                  ) : field.type === 'date' ? (
                    <input
                      type="date"
                      value={formValues[field.id] || ''}
                      onChange={e => updateValue(field.id, e.target.value)}
                      required={field.required}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      style={ringStyle}
                    />
                  ) : field.type === 'file-upload' ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center cursor-pointer hover:border-slate-300 transition-colors">
                      <Upload className="h-6 w-6 mx-auto mb-2 text-slate-300" />
                      <p className="text-xs text-slate-400">{field.placeholder || 'Arrastra archivos aquí o haz click para seleccionar'}</p>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={formValues[field.id] || ''}
                      onChange={e => updateValue(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm"
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={!isValid()}
                className={cn(
                  "w-full py-3 rounded-lg text-white font-semibold text-sm transition-all flex items-center justify-center gap-2",
                  isValid() ? "hover:opacity-90 shadow-lg" : "opacity-50 cursor-not-allowed"
                )}
                style={{ backgroundColor: branding.primaryColor }}
              >
                <Send className="h-4 w-4" />
                Enviar Formulario
              </button>
            </form>
          </div>
        </Card>

        <div className="text-center mt-6 text-xs text-slate-400">
          <p>{branding.systemName} · {BRAND.email}</p>
        </div>
      </div>
    </div>
  );
}
