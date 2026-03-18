import type { Booking, BookingEventType, BookingStatus } from '../operations-types';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const now = new Date();
const d = (offsetDays: number, hour: number, min = 0) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + offsetDays);
  dt.setHours(hour, min, 0, 0);
  return dt.toISOString();
};

const mockEventTypes: BookingEventType[] = [
  { id: 'bet-1', name: 'Evaluación de Propiedad', slug: 'evaluacion', duration: 60, color: '#3B82F6', description: 'Visita y evaluación inicial de la propiedad del vendedor.', location: 'En la propiedad', isActive: true, bufferBefore: 15, bufferAfter: 15, maxPerDay: 4 },
  { id: 'bet-2', name: 'Consulta Inicial', slug: 'consulta', duration: 30, color: '#8B5CF6', description: 'Llamada o videollamada para entender la situación del vendedor.', location: 'Zoom / Teléfono', isActive: true, bufferBefore: 5, bufferAfter: 5, maxPerDay: 8 },
  { id: 'bet-3', name: 'Presentación de Oferta', slug: 'oferta', duration: 45, color: '#10B981', description: 'Reunión para presentar oferta formal al vendedor.', location: 'Oficina / Propiedad', isActive: true, bufferBefore: 10, bufferAfter: 10, maxPerDay: 5 },
  { id: 'bet-4', name: 'Firma de Documentos', slug: 'firma', duration: 90, color: '#EF4444', description: 'Sesión de firma con notario para cierre de transacción.', location: 'Notaría', isActive: true, bufferBefore: 30, bufferAfter: 15, maxPerDay: 2 },
  { id: 'bet-5', name: 'Reunión General', slug: 'reunion', duration: 30, color: '#F59E0B', description: 'Reunión general para otros asuntos.', location: 'Virtual / Presencial', isActive: true, bufferBefore: 5, bufferAfter: 5, maxPerDay: 10 },
];

const mockBookings: Booking[] = [
  { id: 'bk-1', eventTypeId: 'bet-1', eventTypeName: 'Evaluación de Propiedad', guestName: 'Carlos Rivera', guestEmail: 'carlos.r@email.com', guestPhone: '(787) 555-0123', date: d(1, 0).split('T')[0], startTime: '10:00', endTime: '11:00', timezone: 'America/Puerto_Rico', status: 'upcoming', notes: 'Propiedad con filtraciones, llevar cámara.', leadId: 'LD-1001', owner: 'María Santos', location: 'Santa Rosa, Bayamón', createdAt: d(-2, 9) },
  { id: 'bk-2', eventTypeId: 'bet-2', eventTypeName: 'Consulta Inicial', guestName: 'Roberto Hernández', guestEmail: 'roberto.h@email.com', guestPhone: '(787) 555-1111', date: d(1, 0).split('T')[0], startTime: '14:00', endTime: '14:30', timezone: 'America/Puerto_Rico', status: 'upcoming', leadId: 'LD-1007', owner: 'Carlos Reyes', location: 'Zoom', createdAt: d(-1, 11) },
  { id: 'bk-3', eventTypeId: 'bet-3', eventTypeName: 'Presentación de Oferta', guestName: 'Pedro Morales', guestEmail: 'pmorales@email.com', guestPhone: '(939) 555-3333', date: d(2, 0).split('T')[0], startTime: '10:00', endTime: '10:45', timezone: 'America/Puerto_Rico', status: 'upcoming', leadId: 'LD-1009', owner: 'Juan Delgado', location: 'Oficina Guaynabo', createdAt: d(-3, 15) },
  { id: 'bk-4', eventTypeId: 'bet-1', eventTypeName: 'Evaluación de Propiedad', guestName: 'Isabel Torres', guestEmail: 'isa.torres@email.com', guestPhone: '(787) 555-2222', date: d(-1, 0).split('T')[0], startTime: '14:00', endTime: '15:00', timezone: 'America/Puerto_Rico', status: 'completed', leadId: 'LD-1008', owner: 'María Santos', location: 'Guanajibo, Mayagüez', createdAt: d(-5, 10) },
  { id: 'bk-5', eventTypeId: 'bet-2', eventTypeName: 'Consulta Inicial', guestName: 'Diana Cruz', guestEmail: 'dianac@email.com', guestPhone: '(787) 555-4444', date: d(-3, 0).split('T')[0], startTime: '11:00', endTime: '11:30', timezone: 'America/Puerto_Rico', status: 'completed', leadId: 'LD-1010', owner: 'María Santos', location: 'Teléfono', createdAt: d(-7, 14) },
  { id: 'bk-6', eventTypeId: 'bet-2', eventTypeName: 'Consulta Inicial', guestName: 'Sofía Vega', guestEmail: 'svega@email.com', guestPhone: '(939) 555-6666', date: d(-5, 0).split('T')[0], startTime: '09:00', endTime: '09:30', timezone: 'America/Puerto_Rico', status: 'canceled', leadId: 'LD-1012', owner: 'Juan Delgado', location: 'Zoom', createdAt: d(-8, 16), canceledAt: d(-6, 10), cancelReason: 'Vendedora canceló, no está lista para vender.' },
  { id: 'bk-7', eventTypeId: 'bet-1', eventTypeName: 'Evaluación de Propiedad', guestName: 'José Santos', guestEmail: 'jsantos@email.com', guestPhone: '(939) 555-0789', date: d(-2, 0).split('T')[0], startTime: '10:00', endTime: '11:00', timezone: 'America/Puerto_Rico', status: 'no-show', leadId: 'LD-1003', owner: 'Carlos Reyes', location: 'Hato Rey, San Juan', createdAt: d(-6, 9) },
  { id: 'bk-8', eventTypeId: 'bet-4', eventTypeName: 'Firma de Documentos', guestName: 'Ana Martínez', guestEmail: 'ana.mart@email.com', guestPhone: '(787) 555-0321', date: d(5, 0).split('T')[0], startTime: '09:00', endTime: '10:30', timezone: 'America/Puerto_Rico', status: 'upcoming', leadId: 'LD-1004', owner: 'María Santos', location: 'Notaría Carolina', createdAt: d(-1, 11) },
];

export const bookingService = {
  async getAll(): Promise<Booking[]> {
    await delay(300);
    return [...mockBookings];
  },
  async getById(id: string): Promise<Booking | undefined> {
    await delay(200);
    return mockBookings.find(b => b.id === id);
  },
  async getByStatus(status: BookingStatus): Promise<Booking[]> {
    await delay(250);
    return mockBookings.filter(b => b.status === status);
  },
  async create(booking: Partial<Booking>): Promise<Booking> {
    await delay(400);
    const newBooking: Booking = { id: `bk-${Date.now()}`, eventTypeId: '', eventTypeName: '', guestName: '', guestEmail: '', guestPhone: '', date: '', startTime: '', endTime: '', timezone: 'America/Puerto_Rico', status: 'upcoming', owner: 'María Santos', location: '', createdAt: new Date().toISOString(), ...booking } as Booking;
    mockBookings.push(newBooking);
    return newBooking;
  },
  async update(id: string, data: Partial<Booking>): Promise<Booking | undefined> {
    await delay(300);
    const idx = mockBookings.findIndex(b => b.id === id);
    if (idx === -1) return undefined;
    mockBookings[idx] = { ...mockBookings[idx], ...data };
    return mockBookings[idx];
  },
  async archive(id: string): Promise<boolean> {
    await delay(300);
    const idx = mockBookings.findIndex(b => b.id === id);
    if (idx === -1) return false;
    mockBookings[idx].status = 'canceled';
    return true;
  },
  async getEventTypes(): Promise<BookingEventType[]> {
    await delay(200);
    return [...mockEventTypes];
  },
  async getAvailableSlots(eventTypeId: string, date: string): Promise<string[]> {
    await delay(300);
    return ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
  },
};
