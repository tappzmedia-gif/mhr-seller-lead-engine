import type { Template, TemplateCategory } from '../operations-types';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const now = new Date();
const d = (offsetDays: number) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + offsetDays);
  return dt.toISOString();
};

const mockTemplates: Template[] = [
  { id: 'tpl-1', name: 'Oferta Cash Rápida', category: 'proposals', description: 'Propuesta simplificada para ofertas cash con cierre en 7-14 días.', content: 'Portada → Introducción → Oferta → Términos → Firma', variables: ['clientName', 'propertyAddress', 'offerAmount', 'closingDate'], createdAt: d(-60), updatedAt: d(-5), usageCount: 12, isDefault: true, owner: 'María Santos' },
  { id: 'tpl-2', name: 'Propuesta Premium Completa', category: 'proposals', description: 'Propuesta detallada con análisis de mercado y opciones múltiples.', content: 'Portada → Oportunidad → Solución → Análisis → Oferta 3-Pack → Timeline → Testimonios → Términos', variables: ['clientName', 'propertyAddress', 'marketAnalysis', 'packages'], createdAt: d(-45), updatedAt: d(-10), usageCount: 8, isDefault: false, owner: 'María Santos' },
  { id: 'tpl-3', name: 'Propuesta de Herencia', category: 'proposals', description: 'Propuesta sensible para casos de herencia con múltiples herederos.', content: 'Portada → Entendemos su situación → Cómo podemos ayudar → Proceso → Oferta → Términos', variables: ['clientName', 'heirs', 'propertyDetails', 'offerAmount'], createdAt: d(-30), updatedAt: d(-15), usageCount: 7, isDefault: false, owner: 'Juan Delgado' },
  { id: 'tpl-4', name: 'Factura Estándar', category: 'invoices', description: 'Factura básica con líneas de servicio y términos de pago.', content: 'Header → Bill To → Line Items → Subtotal/Tax/Total → Terms → Payment Methods', variables: ['clientName', 'clientEmail', 'lineItems', 'dueDate', 'terms'], createdAt: d(-50), updatedAt: d(-8), usageCount: 20, isDefault: true, owner: 'María Santos' },
  { id: 'tpl-5', name: 'Factura con Depósito', category: 'invoices', description: 'Factura con depósito parcial y balance pendiente.', content: 'Header → Bill To → Deposit Amount → Remaining Balance → Schedule → Terms', variables: ['clientName', 'totalAmount', 'depositAmount', 'balanceDate'], createdAt: d(-40), updatedAt: d(-12), usageCount: 10, isDefault: false, owner: 'María Santos' },
  { id: 'tpl-6', name: 'Email - Follow-up inicial', category: 'emails', description: 'Email de seguimiento después del primer contacto con el vendedor.', content: 'Hola {{clientName}},\n\nGracias por contactarnos. Entendemos que está considerando vender su propiedad en {{municipality}}.\n\nMe gustaría coordinar una breve llamada para entender mejor su situación y explicar cómo podemos ayudarle.\n\n¿Le conviene mañana a las {{suggestedTime}}?\n\nSaludos,\n{{agentName}}\nMy House Realty', variables: ['clientName', 'municipality', 'suggestedTime', 'agentName'], createdAt: d(-55), updatedAt: d(-3), usageCount: 35, isDefault: true, owner: 'María Santos' },
  { id: 'tpl-7', name: 'Email - Propuesta enviada', category: 'emails', description: 'Email acompañando el envío de una propuesta formal.', content: 'Hola {{clientName}},\n\nAdjunto encontrará nuestra propuesta formal para la compra de su propiedad.\n\nPuntos clave:\n- Oferta: {{offerAmount}}\n- Cierre estimado: {{closingDate}}\n- Sin comisiones ni costos ocultos\n\nLa propuesta tiene validez hasta {{expirationDate}}.\n\nQuedo a sus órdenes.\n\n{{agentName}}', variables: ['clientName', 'offerAmount', 'closingDate', 'expirationDate', 'agentName'], createdAt: d(-50), updatedAt: d(-7), usageCount: 18, isDefault: false, owner: 'María Santos' },
  { id: 'tpl-8', name: 'Email - Recordatorio de pago', category: 'emails', description: 'Recordatorio amigable de pago pendiente.', content: 'Hola {{clientName}},\n\nLe recordamos que la factura {{invoiceNumber}} por ${{amount}} tiene fecha de vencimiento {{dueDate}}.\n\nPuede realizar el pago mediante:\n{{paymentMethods}}\n\nSi ya realizó el pago, por favor ignore este mensaje.\n\nGracias,\n{{agentName}}', variables: ['clientName', 'invoiceNumber', 'amount', 'dueDate', 'paymentMethods', 'agentName'], createdAt: d(-35), updatedAt: d(-10), usageCount: 12, isDefault: true, owner: 'María Santos' },
  { id: 'tpl-9', name: 'WhatsApp - Confirmación de cita', category: 'whatsapp', description: 'Mensaje de confirmación de cita programada.', content: '¡Hola {{clientName}}! 👋\n\nLe confirmo su cita:\n📅 {{date}} a las {{time}}\n📍 {{location}}\n\nSi necesita cambiar la hora, avíseme con anticipación.\n\n¡Nos vemos! 🏠', variables: ['clientName', 'date', 'time', 'location'], createdAt: d(-45), updatedAt: d(-5), usageCount: 40, isDefault: true, owner: 'María Santos' },
  { id: 'tpl-10', name: 'WhatsApp - Follow-up rápido', category: 'whatsapp', description: 'Mensaje rápido de seguimiento por WhatsApp.', content: 'Hola {{clientName}}, soy {{agentName}} de My House Realty.\n\nQuería verificar si tuvo oportunidad de revisar la información que le envié. ¿Tiene alguna pregunta?\n\nEstoy disponible cuando guste. 📞', variables: ['clientName', 'agentName'], createdAt: d(-40), updatedAt: d(-8), usageCount: 30, isDefault: false, owner: 'Juan Delgado' },
  { id: 'tpl-11', name: 'Agenda - Reunión de evaluación', category: 'meetings', description: 'Agenda estándar para reuniones de evaluación de propiedad.', content: '1. Introducción y presentación (5 min)\n2. Tour de la propiedad (20 min)\n3. Documentación fotográfica (10 min)\n4. Discusión de condiciones y reparaciones (10 min)\n5. Revisión de documentos disponibles (5 min)\n6. Próximos pasos y timeline (10 min)', variables: ['propertyAddress', 'ownerName', 'evaluatorName'], createdAt: d(-30), updatedAt: d(-10), usageCount: 15, isDefault: true, owner: 'Carlos Reyes' },
  { id: 'tpl-12', name: 'Agenda - Presentación de oferta', category: 'meetings', description: 'Agenda para reunión de presentación de oferta.', content: '1. Resumen de la evaluación (5 min)\n2. Análisis del mercado (10 min)\n3. Presentación de la oferta (10 min)\n4. Explicación de términos y condiciones (10 min)\n5. Preguntas y respuestas (10 min)\n6. Siguientes pasos (5 min)', variables: ['clientName', 'offerAmount', 'propertyAddress'], createdAt: d(-25), updatedAt: d(-5), usageCount: 10, isDefault: false, owner: 'María Santos' },
  { id: 'tpl-13', name: 'Quote Block - Oferta básica', category: 'quotes', description: 'Bloque de cotización para insertar en propuestas.', content: 'Tipo: Oferta Cash\nMonto: {{amount}}\nCierre: {{closingDays}} días\nCondiciones: As-is, sin reparaciones\nDepósito: {{depositAmount}} al firmar', variables: ['amount', 'closingDays', 'depositAmount'], createdAt: d(-20), updatedAt: d(-3), usageCount: 22, isDefault: true, owner: 'María Santos' },
  { id: 'tpl-14', name: 'Quote Block - 3 opciones', category: 'quotes', description: 'Bloque con 3 opciones de oferta para comparación.', content: 'Opción A (Rápido): {{amountA}} - Cierre en 7 días\nOpción B (Estándar): {{amountB}} - Cierre en 30 días\nOpción C (Máximo): {{amountC}} - Cierre en 60 días con contingencias', variables: ['amountA', 'amountB', 'amountC'], createdAt: d(-15), updatedAt: d(-2), usageCount: 8, isDefault: false, owner: 'María Santos' },
];

export const templatesService = {
  async getAll(): Promise<Template[]> {
    await delay(300);
    return [...mockTemplates];
  },
  async getById(id: string): Promise<Template | undefined> {
    await delay(200);
    return mockTemplates.find(t => t.id === id);
  },
  async getByCategory(category: TemplateCategory): Promise<Template[]> {
    await delay(250);
    return mockTemplates.filter(t => t.category === category);
  },
  async create(template: Partial<Template>): Promise<Template> {
    await delay(400);
    const newTpl: Template = { id: `tpl-${Date.now()}`, name: '', category: 'emails', description: '', content: '', variables: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), usageCount: 0, isDefault: false, owner: 'María Santos', ...template } as Template;
    mockTemplates.push(newTpl);
    return newTpl;
  },
  async update(id: string, data: Partial<Template>): Promise<Template | undefined> {
    await delay(300);
    const idx = mockTemplates.findIndex(t => t.id === id);
    if (idx === -1) return undefined;
    mockTemplates[idx] = { ...mockTemplates[idx], ...data };
    return mockTemplates[idx];
  },
  async archive(id: string): Promise<boolean> {
    await delay(300);
    const idx = mockTemplates.findIndex(t => t.id === id);
    if (idx === -1) return false;
    mockTemplates.splice(idx, 1);
    return true;
  },
};
