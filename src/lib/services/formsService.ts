import type { FormDefinition, FormField, FormStatus } from '../operations-types';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const now = new Date();
const d = (offsetDays: number) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + offsetDays);
  return dt.toISOString();
};

const mockForms: FormDefinition[] = [
  {
    id: 'form-1',
    name: 'Formulario de Contacto',
    description: 'Formulario principal para captura de leads del sitio web.',
    status: 'active',
    submissions: 128,
    createdAt: d(-60),
    updatedAt: d(-2),
    owner: 'María Santos',
    fields: [
      { id: 'f1-1', type: 'text', label: 'Nombre Completo', placeholder: 'Ej: Juan Pérez', required: true, active: true, order: 1 },
      { id: 'f1-2', type: 'email', label: 'Correo Electrónico', placeholder: 'tu@email.com', required: true, active: true, order: 2 },
      { id: 'f1-3', type: 'phone', label: 'Teléfono', placeholder: '(787) 555-0000', required: true, active: true, order: 3 },
      { id: 'f1-4', type: 'dropdown', label: 'Tipo de Propiedad', placeholder: 'Seleccionar...', required: true, active: true, options: [{ label: 'Casa', value: 'casa' }, { label: 'Apartamento', value: 'apartamento' }, { label: 'Terreno', value: 'terreno' }, { label: 'Comercial', value: 'comercial' }], order: 4 },
      { id: 'f1-5', type: 'text', label: 'Municipio', placeholder: 'Ej: Bayamón', required: true, active: true, order: 5 },
      { id: 'f1-6', type: 'long-text', label: 'Mensaje Adicional', placeholder: 'Cuéntanos sobre tu situación...', required: false, active: true, order: 6 },
    ],
  },
  {
    id: 'form-2',
    name: 'Solicitud de Evaluación',
    description: 'Formulario para solicitar evaluación gratuita de propiedad.',
    status: 'active',
    submissions: 45,
    createdAt: d(-30),
    updatedAt: d(-5),
    owner: 'Carlos Reyes',
    fields: [
      { id: 'f2-1', type: 'text', label: 'Nombre', placeholder: 'Tu nombre', required: true, active: true, order: 1 },
      { id: 'f2-2', type: 'phone', label: 'Teléfono', placeholder: '(787) 555-0000', required: true, active: true, order: 2 },
      { id: 'f2-3', type: 'email', label: 'Email', placeholder: 'tu@email.com', required: false, active: true, order: 3 },
      { id: 'f2-4', type: 'text', label: 'Dirección de la Propiedad', placeholder: 'Dirección completa', required: true, active: true, order: 4 },
      { id: 'f2-5', type: 'dropdown', label: 'Condición', placeholder: 'Seleccionar...', required: true, active: true, options: [{ label: 'Excelente', value: 'excelente' }, { label: 'Buena', value: 'buena' }, { label: 'Regular', value: 'regular' }, { label: 'Necesita reparaciones', value: 'reparaciones' }, { label: 'Muy deteriorada', value: 'deteriorada' }], order: 5 },
      { id: 'f2-6', type: 'radio', label: 'Timeline', placeholder: '', required: true, active: true, options: [{ label: 'Urgente (7 días)', value: 'urgente' }, { label: 'Este mes', value: 'este-mes' }, { label: '30-60 días', value: '30-60' }, { label: 'Solo evaluando', value: 'evaluando' }], order: 6 },
      { id: 'f2-7', type: 'checkbox', label: 'Acepto términos y condiciones', placeholder: '', required: true, active: true, order: 7 },
      { id: 'f2-8', type: 'file-upload', label: 'Fotos de la Propiedad', placeholder: 'Subir archivos...', required: false, active: true, order: 8 },
    ],
  },
  {
    id: 'form-3',
    name: 'Encuesta de Satisfacción',
    description: 'Encuesta post-cierre para clientes.',
    status: 'inactive',
    submissions: 22,
    createdAt: d(-90),
    updatedAt: d(-45),
    owner: 'Juan Delgado',
    fields: [
      { id: 'f3-1', type: 'text', label: 'Nombre', placeholder: 'Tu nombre', required: true, active: true, order: 1 },
      { id: 'f3-2', type: 'number', label: 'Calificación (1-10)', placeholder: '1-10', required: true, active: true, validation: 'min:1,max:10', order: 2 },
      { id: 'f3-3', type: 'multi-select', label: 'Aspectos Positivos', placeholder: 'Seleccionar...', required: false, active: true, options: [{ label: 'Rapidez', value: 'rapidez' }, { label: 'Transparencia', value: 'transparencia' }, { label: 'Comunicación', value: 'comunicacion' }, { label: 'Precio justo', value: 'precio' }], order: 3 },
      { id: 'f3-4', type: 'long-text', label: 'Comentarios', placeholder: 'Tu feedback...', required: false, active: true, order: 4 },
      { id: 'f3-5', type: 'date', label: 'Fecha de Cierre', placeholder: '', required: false, active: true, order: 5 },
    ],
  },
  {
    id: 'form-4',
    name: 'Registro de Eventos',
    description: 'Formulario para registro de open house y eventos.',
    status: 'draft',
    submissions: 0,
    createdAt: d(-3),
    updatedAt: d(-1),
    owner: 'María Santos',
    fields: [
      { id: 'f4-1', type: 'text', label: 'Nombre Completo', placeholder: 'Tu nombre', required: true, active: true, order: 1 },
      { id: 'f4-2', type: 'email', label: 'Email', placeholder: 'tu@email.com', required: true, active: true, order: 2 },
      { id: 'f4-3', type: 'phone', label: 'Teléfono', placeholder: '(787) 555-0000', required: true, active: true, order: 3 },
      { id: 'f4-4', type: 'number', label: 'Número de Asistentes', placeholder: '1', required: true, active: true, order: 4 },
    ],
  },
];

export const formsService = {
  async getAll(): Promise<FormDefinition[]> {
    await delay(300);
    return [...mockForms];
  },
  async getById(id: string): Promise<FormDefinition | undefined> {
    await delay(200);
    return mockForms.find(f => f.id === id);
  },
  async create(form: Partial<FormDefinition>): Promise<FormDefinition> {
    await delay(400);
    const newForm: FormDefinition = { id: `form-${Date.now()}`, name: '', description: '', status: 'draft', fields: [], submissions: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), owner: 'María Santos', ...form } as FormDefinition;
    mockForms.push(newForm);
    return newForm;
  },
  async update(id: string, data: Partial<FormDefinition>): Promise<FormDefinition | undefined> {
    await delay(300);
    const idx = mockForms.findIndex(f => f.id === id);
    if (idx === -1) return undefined;
    mockForms[idx] = { ...mockForms[idx], ...data, updatedAt: new Date().toISOString() };
    return mockForms[idx];
  },
  async delete(id: string): Promise<boolean> {
    await delay(300);
    const idx = mockForms.findIndex(f => f.id === id);
    if (idx === -1) return false;
    mockForms.splice(idx, 1);
    return true;
  },
  async duplicate(id: string): Promise<FormDefinition | undefined> {
    await delay(400);
    const original = mockForms.find(f => f.id === id);
    if (!original) return undefined;
    const dup: FormDefinition = { ...original, id: `form-${Date.now()}`, name: `${original.name} (Copia)`, status: 'draft', submissions: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), fields: original.fields.map(f => ({ ...f, id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` })) };
    mockForms.push(dup);
    return dup;
  },
};
