import { useState } from 'react';
import { Button, Input } from '@/components/ui-components';
import { MediaManager, type MediaItem } from './MediaManager';
import { X, FileCheck, MapPin, DollarSign, User, Camera } from 'lucide-react';

const PROPERTY_TYPES = ['Casa', 'Apartamento', 'Townhouse', 'Villa', 'Local Comercial', 'Terreno', 'Finca', 'Multifamiliar'];
const CONDITIONS = ['Excelente', 'Buena', 'Regular', 'Necesita reparaciones', 'Deteriorada', 'En construcción'];
const EVALUATORS = ['María Santos', 'Juan Delgado', 'Carlos Reyes', 'Ana Rivera'];

export interface EvaluationFormData {
  leadName: string;
  propertyType: string;
  municipality: string;
  condition: string;
  estimatedValue: string;
  notes: string;
  evaluator: string;
  scheduledDate: string;
  photos: number;
  photoUrls: string[];
}

interface EvaluationCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: EvaluationFormData) => void;
}

interface FormState {
  leadName: string;
  propertyType: string;
  municipality: string;
  condition: string;
  estimatedValue: string;
  notes: string;
  evaluator: string;
  scheduledDate: string;
}

export function EvaluationCreateModal({ open, onClose, onSave }: EvaluationCreateModalProps) {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [form, setForm] = useState<FormState>({
    leadName: '',
    propertyType: 'Casa',
    municipality: '',
    condition: 'Buena',
    estimatedValue: '',
    notes: '',
    evaluator: EVALUATORS[0],
    scheduledDate: '',
  });

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({
      ...form,
      photos: images.length,
      photoUrls: images.map(img => img.url),
    });
    setForm({ leadName: '', propertyType: 'Casa', municipality: '', condition: 'Buena', estimatedValue: '', notes: '', evaluator: EVALUATORS[0], scheduledDate: '' });
    setImages([]);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-[560px] max-w-full bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-slate-900">Nueva Evaluación</h2>
              <p className="text-xs text-slate-500">Completa los datos de la evaluación</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Datos del Lead</h4>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Nombre del Lead *</label>
              <Input value={form.leadName} onChange={e => updateField('leadName', e.target.value)} placeholder="Nombre completo" />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 space-y-4">
            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Datos de la Propiedad</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Tipo de Propiedad</label>
                <select value={form.propertyType} onChange={e => updateField('propertyType', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Municipio</label>
                <Input value={form.municipality} onChange={e => updateField('municipality', e.target.value)} placeholder="Ej: Bayamón" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Condición</label>
                <select value={form.condition} onChange={e => updateField('condition', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Fecha Programada</label>
                <Input type="date" value={form.scheduledDate} onChange={e => updateField('scheduledDate', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 space-y-4">
            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" /> Valoración</h4>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Valor Estimado</label>
              <Input type="text" value={form.estimatedValue} onChange={e => updateField('estimatedValue', e.target.value)} placeholder="$150,000" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Evaluador</label>
              <select value={form.evaluator} onChange={e => updateField('evaluator', e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                {EVALUATORS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Notas</label>
            <textarea
              value={form.notes}
              onChange={e => updateField('notes', e.target.value)}
              placeholder="Notas sobre la evaluación..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><Camera className="h-4 w-4 text-primary" /> Fotos de la Evaluación</h4>
            <MediaManager images={images} onChange={setImages} maxImages={30} />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex gap-3 shrink-0">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button onClick={handleSave} className="flex-1" disabled={!form.leadName.trim()}>Crear Evaluación</Button>
        </div>
      </div>
    </>
  );
}
