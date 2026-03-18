import type { Meeting, MeetingProvider, MeetingStatus } from '../operations-types';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const now = new Date();
const d = (offsetDays: number, hour: number, min = 0) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + offsetDays);
  dt.setHours(hour, min, 0, 0);
  return dt.toISOString();
};

const mockMeetings: Meeting[] = [
  { id: 'mtg-1', title: 'Consulta inicial - Carlos Rivera', provider: 'zoom', status: 'scheduled', outcome: null, date: d(0, 14).split('T')[0], startTime: '14:00', endTime: '14:30', duration: 30, meetingLink: 'https://zoom.us/j/123456789', attendees: [{ name: 'Carlos Rivera', email: 'carlos.r@email.com', role: 'Seller' }], leadId: 'LD-1001', leadName: 'Carlos Rivera', owner: 'María Santos', createdAt: d(-2, 10), activities: [{ id: 'ma-1', action: 'Meeting scheduled', date: d(-2, 10), author: 'María Santos' }], agenda: '1. Revisar situación de la propiedad\n2. Explicar proceso de evaluación\n3. Definir próximos pasos' },
  { id: 'mtg-2', title: 'Presentación de oferta - Pedro Morales', provider: 'in-person', status: 'scheduled', outcome: null, date: d(2, 10).split('T')[0], startTime: '10:00', endTime: '11:00', duration: 60, location: 'Oficina Guaynabo', attendees: [{ name: 'Pedro Morales', email: 'pmorales@email.com', role: 'Seller' }, { name: 'Abogado López', email: 'abogado@firm.com', role: 'Legal' }], leadId: 'LD-1009', leadName: 'Pedro Morales', owner: 'Juan Delgado', createdAt: d(-3, 14), activities: [{ id: 'ma-2', action: 'Meeting scheduled', date: d(-3, 14), author: 'Juan Delgado' }], agenda: '1. Presentar oferta final\n2. Revisión de términos\n3. Timeline de cierre' },
  { id: 'mtg-3', title: 'Follow-up herencia - María López', provider: 'whatsapp', status: 'completed', outcome: 'follow-up-needed', date: d(-1, 11).split('T')[0], startTime: '11:00', endTime: '11:20', duration: 20, attendees: [{ name: 'María López', email: 'm.lopez88@email.com', role: 'Seller' }], leadId: 'LD-1002', leadName: 'María López', owner: 'Juan Delgado', createdAt: d(-3, 9), activities: [{ id: 'ma-3', action: 'Meeting completed', date: d(-1, 11, 20), author: 'Juan Delgado' }, { id: 'ma-3b', action: 'Outcome: Follow-up needed - Esperando declaratoria', date: d(-1, 11, 25), author: 'Juan Delgado' }], notes: 'María está esperando la declaratoria de herederos. Prometió enviárnosla la próxima semana.', outcomeNotes: 'Esperando documentos legales' },
  { id: 'mtg-4', title: 'Evaluación virtual - Isabel Torres', provider: 'google-meet', status: 'completed', outcome: 'positive', date: d(-2, 15).split('T')[0], startTime: '15:00', endTime: '15:45', duration: 45, meetingLink: 'https://meet.google.com/abc-defg-hij', attendees: [{ name: 'Isabel Torres', email: 'isa.torres@email.com', role: 'Seller' }], leadId: 'LD-1008', leadName: 'Isabel Torres', owner: 'María Santos', createdAt: d(-4, 8), activities: [{ id: 'ma-4', action: 'Meeting completed', date: d(-2, 15, 45), author: 'María Santos' }, { id: 'ma-4b', action: 'Outcome: Positive - Vendedora motivada', date: d(-2, 16), author: 'María Santos' }], notes: 'Vendedora muy motivada. Riesgo de ejecución inminente.', outcomeNotes: 'Proceder con oferta urgente' },
  { id: 'mtg-5', title: 'Llamada exploratoria - José Santos', provider: 'phone', status: 'canceled', outcome: null, date: d(-3, 10).split('T')[0], startTime: '10:00', endTime: '10:30', duration: 30, attendees: [{ name: 'José Santos', email: 'jsantos@email.com', role: 'Seller' }], leadId: 'LD-1003', leadName: 'José Santos', owner: 'Carlos Reyes', createdAt: d(-5, 14), activities: [{ id: 'ma-5', action: 'Meeting canceled by seller', date: d(-4, 9), author: 'System' }] },
  { id: 'mtg-6', title: 'Reunión equipo - Pipeline review', provider: 'teams', status: 'completed', outcome: 'neutral', date: d(-1, 8, 30).split('T')[0], startTime: '08:30', endTime: '09:30', duration: 60, meetingLink: 'https://teams.microsoft.com/l/meetup/123', attendees: [{ name: 'María Santos', email: 'maria@myhouserealty.com', role: 'Admin' }, { name: 'Carlos Reyes', email: 'carlos@myhouserealty.com', role: 'Agent' }, { name: 'Juan Delgado', email: 'juan@myhouserealty.com', role: 'Agent' }], owner: 'María Santos', createdAt: d(-7, 8), activities: [{ id: 'ma-6', action: 'Meeting completed', date: d(-1, 9, 30), author: 'María Santos' }], notes: 'Review semanal del pipeline. 3 deals en negociación, 2 evaluaciones pendientes.' },
  { id: 'mtg-7', title: 'Revisión propiedad - Ana Martínez', provider: 'in-person', status: 'scheduled', outcome: null, date: d(1, 11).split('T')[0], startTime: '11:00', endTime: '12:00', duration: 60, location: 'Valle Arriba, Carolina', attendees: [{ name: 'Ana Martínez', email: 'ana.mart@email.com', role: 'Seller' }], leadId: 'LD-1004', leadName: 'Ana Martínez', owner: 'María Santos', createdAt: d(-1, 9), activities: [{ id: 'ma-7', action: 'Meeting scheduled', date: d(-1, 9), author: 'María Santos' }], agenda: '1. Inspección de las 3 unidades\n2. Fotos y documentación\n3. Discutir timeline de mudanza' },
  { id: 'mtg-8', title: 'Consulta remota - Carmen Díaz', provider: 'zoom', status: 'no-show', outcome: 'negative', date: d(-4, 16).split('T')[0], startTime: '16:00', endTime: '16:30', duration: 30, meetingLink: 'https://zoom.us/j/987654321', attendees: [{ name: 'Carmen Díaz', email: 'carmen.fl@email.com', role: 'Seller' }], leadId: 'LD-1006', leadName: 'Carmen Díaz', owner: 'Juan Delgado', createdAt: d(-6, 11), activities: [{ id: 'ma-8', action: 'No-show recorded', date: d(-4, 16, 15), author: 'System' }], outcomeNotes: 'Vendedora no se conectó. Intentar reagendar.' },
];

export const meetingsService = {
  async getAll(): Promise<Meeting[]> {
    await delay(300);
    return [...mockMeetings];
  },
  async getById(id: string): Promise<Meeting | undefined> {
    await delay(200);
    return mockMeetings.find(m => m.id === id);
  },
  async getByProvider(provider: MeetingProvider): Promise<Meeting[]> {
    await delay(250);
    return mockMeetings.filter(m => m.provider === provider);
  },
  async getByStatus(status: MeetingStatus): Promise<Meeting[]> {
    await delay(250);
    return mockMeetings.filter(m => m.status === status);
  },
  async create(meeting: Partial<Meeting>): Promise<Meeting> {
    await delay(400);
    const newMeeting: Meeting = { id: `mtg-${Date.now()}`, title: '', provider: 'zoom', status: 'scheduled', outcome: null, date: '', startTime: '', endTime: '', duration: 30, attendees: [], owner: 'María Santos', createdAt: new Date().toISOString(), activities: [], ...meeting } as Meeting;
    mockMeetings.push(newMeeting);
    return newMeeting;
  },
  async update(id: string, data: Partial<Meeting>): Promise<Meeting | undefined> {
    await delay(300);
    const idx = mockMeetings.findIndex(m => m.id === id);
    if (idx === -1) return undefined;
    mockMeetings[idx] = { ...mockMeetings[idx], ...data };
    return mockMeetings[idx];
  },
  async archive(id: string): Promise<boolean> {
    await delay(300);
    const idx = mockMeetings.findIndex(m => m.id === id);
    if (idx === -1) return false;
    mockMeetings[idx].status = 'canceled';
    return true;
  },
};
