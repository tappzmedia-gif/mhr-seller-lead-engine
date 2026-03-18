import type { CalendarEvent, AvailabilitySlot, CalendarIntegration, EventType } from '../operations-types';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const EVENT_COLORS: Record<EventType, string> = {
  'property-viewing': '#3B82F6',
  'seller-meeting': '#8B5CF6',
  'follow-up': '#F59E0B',
  'evaluation': '#10B981',
  'closing': '#EF4444',
  'team-meeting': '#6366F1',
  'other': '#94A3B8',
};

const now = new Date();
const d = (offsetDays: number, hour: number, min = 0) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + offsetDays);
  dt.setHours(hour, min, 0, 0);
  return dt.toISOString();
};

const mockEvents: CalendarEvent[] = [
  { id: 'evt-1', title: 'Visita propiedad - Carlos Rivera', type: 'property-viewing', startDate: d(0, 10), endDate: d(0, 11), allDay: false, location: 'Santa Rosa, Bayamón', attendees: ['Carlos Rivera'], leadId: 'LD-1001', leadName: 'Carlos Rivera', owner: 'María Santos', color: EVENT_COLORS['property-viewing'], status: 'confirmed', reminderMinutes: 30, createdAt: d(-2, 9), description: 'Visita inicial para evaluar condición de la propiedad.' },
  { id: 'evt-2', title: 'Reunión con vendedor - María López', type: 'seller-meeting', startDate: d(0, 14), endDate: d(0, 15), allDay: false, location: 'Oficina Ponce', attendees: ['María López'], leadId: 'LD-1002', leadName: 'María López', owner: 'Juan Delgado', color: EVENT_COLORS['seller-meeting'], status: 'confirmed', reminderMinutes: 60, createdAt: d(-3, 11) },
  { id: 'evt-3', title: 'Follow-up Ana Martínez', type: 'follow-up', startDate: d(1, 9), endDate: d(1, 9, 30), allDay: false, attendees: ['Ana Martínez'], leadId: 'LD-1004', leadName: 'Ana Martínez', owner: 'María Santos', color: EVENT_COLORS['follow-up'], status: 'confirmed', reminderMinutes: 15, createdAt: d(-1, 8) },
  { id: 'evt-4', title: 'Evaluación propiedad - Luis García', type: 'evaluation', startDate: d(1, 11), endDate: d(1, 12, 30), allDay: false, location: 'Miraflores, Arecibo', attendees: ['Luis García', 'Tasador'], leadId: 'LD-1005', leadName: 'Luis García', owner: 'Carlos Reyes', color: EVENT_COLORS['evaluation'], status: 'tentative', reminderMinutes: 60, createdAt: d(-1, 14) },
  { id: 'evt-5', title: 'Cierre - Pedro Morales', type: 'closing', startDate: d(2, 10), endDate: d(2, 12), allDay: false, location: 'Notaría San Juan', attendees: ['Pedro Morales', 'Abogado'], leadId: 'LD-1009', leadName: 'Pedro Morales', owner: 'Juan Delgado', color: EVENT_COLORS['closing'], status: 'confirmed', reminderMinutes: 120, createdAt: d(-5, 10) },
  { id: 'evt-6', title: 'Reunión de equipo semanal', type: 'team-meeting', startDate: d(3, 8, 30), endDate: d(3, 9, 30), allDay: false, location: 'Zoom', attendees: ['María Santos', 'Carlos Reyes', 'Juan Delgado'], owner: 'María Santos', color: EVENT_COLORS['team-meeting'], status: 'confirmed', reminderMinutes: 15, createdAt: d(-7, 8) },
  { id: 'evt-7', title: 'Visita propiedad - Isabel Torres', type: 'property-viewing', startDate: d(-1, 14), endDate: d(-1, 15), allDay: false, location: 'Guanajibo, Mayagüez', attendees: ['Isabel Torres'], leadId: 'LD-1008', leadName: 'Isabel Torres', owner: 'María Santos', color: EVENT_COLORS['property-viewing'], status: 'confirmed', reminderMinutes: 30, createdAt: d(-4, 10) },
  { id: 'evt-8', title: 'Follow-up Carmen Díaz', type: 'follow-up', startDate: d(4, 10), endDate: d(4, 10, 30), allDay: false, attendees: ['Carmen Díaz'], leadId: 'LD-1006', leadName: 'Carmen Díaz', owner: 'Juan Delgado', color: EVENT_COLORS['follow-up'], status: 'confirmed', reminderMinutes: 15, createdAt: d(0, 8) },
  { id: 'evt-9', title: 'Evaluación comercial - Miguel Colón', type: 'evaluation', startDate: d(5, 9), endDate: d(5, 11), allDay: false, location: 'Centro, Ponce', attendees: ['Miguel Colón', 'Perito'], leadId: 'LD-1011', leadName: 'Miguel Colón', owner: 'Carlos Reyes', color: EVENT_COLORS['evaluation'], status: 'tentative', reminderMinutes: 60, createdAt: d(-1, 16) },
  { id: 'evt-10', title: 'Reunión con vendedor - Diana Cruz', type: 'seller-meeting', startDate: d(6, 11), endDate: d(6, 12), allDay: false, location: 'Oficina Bayamón', attendees: ['Diana Cruz'], leadId: 'LD-1010', leadName: 'Diana Cruz', owner: 'María Santos', color: EVENT_COLORS['seller-meeting'], status: 'confirmed', reminderMinutes: 30, createdAt: d(0, 15) },
];

const mockAvailability: AvailabilitySlot[] = [
  { id: 'av-1', dayOfWeek: 1, startTime: '08:00', endTime: '12:00', isActive: true },
  { id: 'av-2', dayOfWeek: 1, startTime: '13:00', endTime: '17:00', isActive: true },
  { id: 'av-3', dayOfWeek: 2, startTime: '08:00', endTime: '12:00', isActive: true },
  { id: 'av-4', dayOfWeek: 2, startTime: '13:00', endTime: '17:00', isActive: true },
  { id: 'av-5', dayOfWeek: 3, startTime: '08:00', endTime: '12:00', isActive: true },
  { id: 'av-6', dayOfWeek: 3, startTime: '13:00', endTime: '17:00', isActive: true },
  { id: 'av-7', dayOfWeek: 4, startTime: '08:00', endTime: '12:00', isActive: true },
  { id: 'av-8', dayOfWeek: 4, startTime: '13:00', endTime: '17:00', isActive: true },
  { id: 'av-9', dayOfWeek: 5, startTime: '08:00', endTime: '12:00', isActive: true },
  { id: 'av-10', dayOfWeek: 5, startTime: '13:00', endTime: '15:00', isActive: true },
  { id: 'av-11', dayOfWeek: 6, startTime: '09:00', endTime: '12:00', isActive: false },
];

const mockIntegrations: CalendarIntegration[] = [
  { provider: 'google', name: 'Google Calendar', status: 'connected', lastSync: d(0, -1), email: 'maria@myhouserealty.com' },
  { provider: 'outlook', name: 'Outlook Calendar', status: 'disconnected' },
  { provider: 'apple', name: 'Apple Calendar', status: 'coming-soon' },
];

export const calendarService = {
  async getAll(): Promise<CalendarEvent[]> {
    await delay(300);
    return [...mockEvents];
  },
  async getById(id: string): Promise<CalendarEvent | undefined> {
    await delay(200);
    return mockEvents.find(e => e.id === id);
  },
  async create(event: Partial<CalendarEvent>): Promise<CalendarEvent> {
    await delay(400);
    const newEvent: CalendarEvent = { id: `evt-${Date.now()}`, title: '', type: 'other', startDate: new Date().toISOString(), endDate: new Date().toISOString(), allDay: false, attendees: [], owner: 'María Santos', color: EVENT_COLORS['other'], status: 'confirmed', reminderMinutes: 30, createdAt: new Date().toISOString(), ...event } as CalendarEvent;
    mockEvents.push(newEvent);
    return newEvent;
  },
  async update(id: string, data: Partial<CalendarEvent>): Promise<CalendarEvent | undefined> {
    await delay(300);
    const idx = mockEvents.findIndex(e => e.id === id);
    if (idx === -1) return undefined;
    mockEvents[idx] = { ...mockEvents[idx], ...data };
    return mockEvents[idx];
  },
  async archive(id: string): Promise<boolean> {
    await delay(300);
    const idx = mockEvents.findIndex(e => e.id === id);
    if (idx === -1) return false;
    mockEvents[idx].status = 'cancelled';
    return true;
  },
  async getAvailability(): Promise<AvailabilitySlot[]> {
    await delay(200);
    return [...mockAvailability];
  },
  async getIntegrations(): Promise<CalendarIntegration[]> {
    await delay(200);
    return [...mockIntegrations];
  },
};
