import { useState } from 'react';
import { Button, Input } from '@/components/ui-components';
import { X, UserPlus, Phone, Mail, MapPin, Home } from 'lucide-react';

interface ClientCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; phone: string; email: string; address: string; municipality: string; region: string }) => void;
}

const REGIONS = [
  { value: 'Metro', municipalities: ['San Juan', 'Bayamón', 'Carolina', 'Guaynabo', 'Trujillo Alto', 'Cataño', 'Toa Baja'] },
  { value: 'Norte', municipalities: ['Arecibo', 'Manatí', 'Vega Baja', 'Dorado', 'Toa Alta'] },
  { value: 'Sur', municipalities: ['Ponce', 'Juana Díaz', 'Coamo', 'Salinas', 'Guayama'] },
  { value: 'Este', municipalities: ['Humacao', 'Fajardo', 'Río Grande', 'Caguas', 'Juncos'] },
  { value: 'Oeste', municipalities: ['Mayagüez', 'Aguadilla', 'San Germán', 'Cabo Rojo', 'Rincón'] },
  { value: 'Centro', municipalities: ['Cayey', 'Cidra', 'Barranquitas', 'Orocovis', 'Utuado'] },
];

export function ClientCreateModal({ open, onClose, onSave }: ClientCreateModalProps) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    municipality: '',
    region: '',
  });

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const selectRegion = (region: string) => {
    setForm(prev => ({ ...prev, region, municipality: '' }));
  };

  const selectedRegion = REGIONS.find(r => r.value === form.region);

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave(form);
    setForm({ name: '', phone: '', email: '', address: '', municipality: '', region: '' });
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] max-w-[95vw] bg-white rounded-2xl shadow-2xl z-50">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-slate-900">Nuevo Cliente</h2>
              <p className="text-xs text-slate-500">Agrega un nuevo cliente al sistema</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Nombre Completo *</label>
            <Input value={form.name} onChange={e => updateField('name', e.target.value)} placeholder="Nombre del cliente" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block flex items-center gap-1"><Phone className="h-3 w-3" /> Teléfono</label>
              <Input value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder="(787) 555-0000" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block flex items-center gap-1"><Mail className="h-3 w-3" /> Email</label>
              <Input value={form.email} onChange={e => updateField('email', e.target.value)} placeholder="email@ejemplo.com" type="email" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block flex items-center gap-1"><Home className="h-3 w-3" /> Dirección</label>
            <Input value={form.address} onChange={e => updateField('address', e.target.value)} placeholder="Dirección completa" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block flex items-center gap-1"><MapPin className="h-3 w-3" /> Región</label>
              <select
                value={form.region}
                onChange={e => selectRegion(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="">Seleccionar...</option>
                {REGIONS.map(r => <option key={r.value} value={r.value}>{r.value}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Municipio</label>
              <select
                value={form.municipality}
                onChange={e => updateField('municipality', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                disabled={!selectedRegion}
              >
                <option value="">Seleccionar...</option>
                {selectedRegion?.municipalities.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button onClick={handleSave} className="flex-1" disabled={!form.name.trim()}>Crear Cliente</Button>
        </div>
      </div>
    </>
  );
}
