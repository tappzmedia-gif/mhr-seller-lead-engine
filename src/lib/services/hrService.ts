import type {
  Employee, Candidate, HiringStage,
  BenefitPlan, TimeOffRequest, AttendanceRecord,
  PerformanceReview, CompanyPolicy, OrgNode
} from '../operations-types';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const now = new Date();
const d = (offsetDays: number) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + offsetDays);
  return dt.toISOString();
};

const mockEmployees: Employee[] = [
  {
    id: 'emp-1', name: 'María Santos', email: 'maria@myhouserealty.com', phone: '(787) 555-1001', role: 'Director General', department: 'Operations', hireDate: d(-365), status: 'active', avatar: 'MS', salary: 85000, address: 'San Juan, PR 00901', manager: undefined, dateOfBirth: '1985-03-15', emergencyContact: 'Luis Santos (787) 555-8001', performanceRating: 4.8,
    ptoBalance: { vacation: { available: 12, used: 8, total: 20 }, sick: { available: 8, used: 2, total: 10 }, personal: { available: 2, used: 1, total: 3 } },
    benefits: [
      { planId: 'bp-1', planName: 'Premium Health PPO', type: 'health', enrolledDate: d(-360), status: 'active', employeeCost: 180 },
      { planId: 'bp-3', planName: 'Delta Dental Premier', type: 'dental', enrolledDate: d(-360), status: 'active', employeeCost: 25 },
      { planId: 'bp-5', planName: 'VSP Vision Choice', type: 'vision', enrolledDate: d(-360), status: 'active', employeeCost: 12 },
      { planId: 'bp-7', planName: '401(k) Retirement Plan', type: '401k', enrolledDate: d(-360), status: 'active', employeeCost: 425 },
    ],
    payrollHistory: [
      { id: 'pr-1', period: 'Mar 2026', grossPay: 7083, deductions: 1770, netPay: 5313, status: 'paid', paidDate: d(-1) },
      { id: 'pr-2', period: 'Feb 2026', grossPay: 7083, deductions: 1770, netPay: 5313, status: 'paid', paidDate: d(-31) },
      { id: 'pr-3', period: 'Jan 2026', grossPay: 7083, deductions: 1770, netPay: 5313, status: 'paid', paidDate: d(-59) },
    ],
  },
  {
    id: 'emp-2', name: 'Carlos Reyes', email: 'carlos@myhouserealty.com', phone: '(787) 555-1002', role: 'Senior Sales Agent', department: 'Sales', hireDate: d(-200), status: 'active', avatar: 'CR', salary: 55000, manager: 'emp-1', dateOfBirth: '1990-07-22', emergencyContact: 'Ana Reyes (787) 555-8002', performanceRating: 4.2,
    ptoBalance: { vacation: { available: 10, used: 5, total: 15 }, sick: { available: 7, used: 3, total: 10 }, personal: { available: 3, used: 0, total: 3 } },
    benefits: [
      { planId: 'bp-2', planName: 'Standard Health HMO', type: 'health', enrolledDate: d(-195), status: 'active', employeeCost: 120 },
      { planId: 'bp-3', planName: 'Delta Dental Premier', type: 'dental', enrolledDate: d(-195), status: 'active', employeeCost: 25 },
    ],
    payrollHistory: [
      { id: 'pr-4', period: 'Mar 2026', grossPay: 4583, deductions: 1145, netPay: 3438, status: 'paid', paidDate: d(-1) },
      { id: 'pr-5', period: 'Feb 2026', grossPay: 4583, deductions: 1145, netPay: 3438, status: 'paid', paidDate: d(-31) },
    ],
  },
  {
    id: 'emp-3', name: 'Juan Delgado', email: 'juan@myhouserealty.com', phone: '(787) 555-1003', role: 'Sales Agent', department: 'Sales', hireDate: d(-150), status: 'active', avatar: 'JD', salary: 52000, manager: 'emp-2', dateOfBirth: '1992-11-08', performanceRating: 3.8,
    ptoBalance: { vacation: { available: 8, used: 7, total: 15 }, sick: { available: 9, used: 1, total: 10 }, personal: { available: 1, used: 2, total: 3 } },
    benefits: [
      { planId: 'bp-2', planName: 'Standard Health HMO', type: 'health', enrolledDate: d(-145), status: 'active', employeeCost: 120 },
    ],
    payrollHistory: [
      { id: 'pr-6', period: 'Mar 2026', grossPay: 4333, deductions: 1083, netPay: 3250, status: 'pending' },
      { id: 'pr-7', period: 'Feb 2026', grossPay: 4333, deductions: 1083, netPay: 3250, status: 'paid', paidDate: d(-31) },
    ],
  },
  {
    id: 'emp-4', name: 'Ana Rodríguez', email: 'ana@myhouserealty.com', phone: '(787) 555-1004', role: 'Junior Agent', department: 'Sales', hireDate: d(-60), status: 'active', avatar: 'AR', salary: 42000, manager: 'emp-2', dateOfBirth: '1995-04-30', performanceRating: 3.5,
    ptoBalance: { vacation: { available: 13, used: 2, total: 15 }, sick: { available: 10, used: 0, total: 10 }, personal: { available: 3, used: 0, total: 3 } },
    benefits: [
      { planId: 'bp-2', planName: 'Standard Health HMO', type: 'health', enrolledDate: d(-55), status: 'active', employeeCost: 120 },
      { planId: 'bp-4', planName: 'Delta Dental Basic', type: 'dental', enrolledDate: d(-55), status: 'active', employeeCost: 15 },
    ],
    payrollHistory: [
      { id: 'pr-8', period: 'Mar 2026', grossPay: 3500, deductions: 875, netPay: 2625, status: 'pending' },
    ],
  },
  {
    id: 'emp-5', name: 'Pedro Ortiz', email: 'pedro@myhouserealty.com', phone: '(787) 555-1005', role: 'Marketing Coordinator', department: 'Marketing', hireDate: d(-90), status: 'active', avatar: 'PO', salary: 48000, manager: 'emp-1', dateOfBirth: '1991-09-12', performanceRating: 4.0,
    ptoBalance: { vacation: { available: 11, used: 4, total: 15 }, sick: { available: 8, used: 2, total: 10 }, personal: { available: 2, used: 1, total: 3 } },
    benefits: [
      { planId: 'bp-1', planName: 'Premium Health PPO', type: 'health', enrolledDate: d(-85), status: 'active', employeeCost: 180 },
      { planId: 'bp-3', planName: 'Delta Dental Premier', type: 'dental', enrolledDate: d(-85), status: 'active', employeeCost: 25 },
      { planId: 'bp-5', planName: 'VSP Vision Choice', type: 'vision', enrolledDate: d(-85), status: 'active', employeeCost: 12 },
    ],
    payrollHistory: [
      { id: 'pr-9', period: 'Mar 2026', grossPay: 4000, deductions: 1000, netPay: 3000, status: 'paid', paidDate: d(-1) },
    ],
  },
  {
    id: 'emp-6', name: 'Laura Méndez', email: 'laura@myhouserealty.com', phone: '(787) 555-1006', role: 'Finance Manager', department: 'Finance', hireDate: d(-180), status: 'active', avatar: 'LM', salary: 65000, manager: 'emp-1', dateOfBirth: '1988-01-25', performanceRating: 4.5,
    ptoBalance: { vacation: { available: 6, used: 9, total: 15 }, sick: { available: 7, used: 3, total: 10 }, personal: { available: 1, used: 2, total: 3 } },
    benefits: [
      { planId: 'bp-1', planName: 'Premium Health PPO', type: 'health', enrolledDate: d(-175), status: 'active', employeeCost: 180 },
      { planId: 'bp-3', planName: 'Delta Dental Premier', type: 'dental', enrolledDate: d(-175), status: 'active', employeeCost: 25 },
      { planId: 'bp-5', planName: 'VSP Vision Choice', type: 'vision', enrolledDate: d(-175), status: 'active', employeeCost: 12 },
      { planId: 'bp-6', planName: 'Term Life Insurance', type: 'life', enrolledDate: d(-175), status: 'active', employeeCost: 18 },
      { planId: 'bp-7', planName: '401(k) Retirement Plan', type: '401k', enrolledDate: d(-175), status: 'active', employeeCost: 325 },
    ],
    payrollHistory: [
      { id: 'pr-10', period: 'Mar 2026', grossPay: 5417, deductions: 1354, netPay: 4063, status: 'paid', paidDate: d(-1) },
    ],
  },
  {
    id: 'emp-7', name: 'Roberto Vega', email: 'roberto@myhouserealty.com', phone: '(787) 555-1007', role: 'IT Specialist', department: 'Technology', hireDate: d(-120), status: 'on-leave', avatar: 'RV', salary: 58000, manager: 'emp-1', dateOfBirth: '1993-06-18', performanceRating: 4.1,
    ptoBalance: { vacation: { available: 3, used: 12, total: 15 }, sick: { available: 2, used: 8, total: 10 }, personal: { available: 0, used: 3, total: 3 } },
    benefits: [
      { planId: 'bp-1', planName: 'Premium Health PPO', type: 'health', enrolledDate: d(-115), status: 'active', employeeCost: 180 },
      { planId: 'bp-3', planName: 'Delta Dental Premier', type: 'dental', enrolledDate: d(-115), status: 'active', employeeCost: 25 },
      { planId: 'bp-8', planName: 'Short-Term Disability', type: 'disability', enrolledDate: d(-115), status: 'active', employeeCost: 22 },
    ],
    payrollHistory: [
      { id: 'pr-11', period: 'Mar 2026', grossPay: 4833, deductions: 1208, netPay: 3625, status: 'processing' },
    ],
  },
  {
    id: 'emp-8', name: 'Carmen Flores', email: 'carmen@myhouserealty.com', phone: '(787) 555-1008', role: 'HR Coordinator', department: 'HR', hireDate: d(-240), status: 'active', avatar: 'CF', salary: 50000, manager: 'emp-1', dateOfBirth: '1989-12-03', performanceRating: 4.3,
    ptoBalance: { vacation: { available: 9, used: 6, total: 15 }, sick: { available: 6, used: 4, total: 10 }, personal: { available: 2, used: 1, total: 3 } },
    benefits: [
      { planId: 'bp-1', planName: 'Premium Health PPO', type: 'health', enrolledDate: d(-235), status: 'active', employeeCost: 180 },
      { planId: 'bp-3', planName: 'Delta Dental Premier', type: 'dental', enrolledDate: d(-235), status: 'active', employeeCost: 25 },
      { planId: 'bp-5', planName: 'VSP Vision Choice', type: 'vision', enrolledDate: d(-235), status: 'active', employeeCost: 12 },
      { planId: 'bp-7', planName: '401(k) Retirement Plan', type: '401k', enrolledDate: d(-235), status: 'active', employeeCost: 250 },
    ],
    payrollHistory: [
      { id: 'pr-12', period: 'Mar 2026', grossPay: 4167, deductions: 1042, netPay: 3125, status: 'paid', paidDate: d(-1) },
    ],
  },
  {
    id: 'emp-9', name: 'Diego Martínez', email: 'diego@myhouserealty.com', phone: '(787) 555-1009', role: 'Sales Agent', department: 'Sales', hireDate: d(-300), status: 'active', avatar: 'DM', salary: 54000, manager: 'emp-2', dateOfBirth: '1991-05-14', performanceRating: 4.4,
    ptoBalance: { vacation: { available: 7, used: 8, total: 15 }, sick: { available: 5, used: 5, total: 10 }, personal: { available: 1, used: 2, total: 3 } },
    benefits: [
      { planId: 'bp-1', planName: 'Premium Health PPO', type: 'health', enrolledDate: d(-295), status: 'active', employeeCost: 180 },
      { planId: 'bp-3', planName: 'Delta Dental Premier', type: 'dental', enrolledDate: d(-295), status: 'active', employeeCost: 25 },
    ],
    payrollHistory: [
      { id: 'pr-13', period: 'Mar 2026', grossPay: 4500, deductions: 1125, netPay: 3375, status: 'paid', paidDate: d(-1) },
    ],
  },
  {
    id: 'emp-10', name: 'Isabel Cruz', email: 'isabel@myhouserealty.com', phone: '(787) 555-1010', role: 'Administrative Assistant', department: 'Operations', hireDate: d(-400), status: 'active', avatar: 'IC', salary: 38000, manager: 'emp-1', dateOfBirth: '1994-08-27', performanceRating: 3.9,
    ptoBalance: { vacation: { available: 5, used: 10, total: 15 }, sick: { available: 4, used: 6, total: 10 }, personal: { available: 0, used: 3, total: 3 } },
    benefits: [
      { planId: 'bp-2', planName: 'Standard Health HMO', type: 'health', enrolledDate: d(-395), status: 'active', employeeCost: 120 },
      { planId: 'bp-4', planName: 'Delta Dental Basic', type: 'dental', enrolledDate: d(-395), status: 'active', employeeCost: 15 },
    ],
    payrollHistory: [
      { id: 'pr-14', period: 'Mar 2026', grossPay: 3167, deductions: 792, netPay: 2375, status: 'paid', paidDate: d(-1) },
    ],
  },
  {
    id: 'emp-11', name: 'Fernando Ruiz', email: 'fernando@myhouserealty.com', phone: '(787) 555-1011', role: 'Closing Specialist', department: 'Sales', hireDate: d(-270), status: 'terminated', avatar: 'FR', salary: 50000, manager: 'emp-2', dateOfBirth: '1987-02-11', performanceRating: 2.5,
    ptoBalance: { vacation: { available: 15, used: 0, total: 15 }, sick: { available: 10, used: 0, total: 10 }, personal: { available: 3, used: 0, total: 3 } },
    benefits: [],
    payrollHistory: [
      { id: 'pr-15', period: 'Feb 2026', grossPay: 4167, deductions: 1042, netPay: 3125, status: 'paid', paidDate: d(-31) },
    ],
  },
];

const mockCandidates: Candidate[] = [
  { id: 'cand-1', name: 'Gabriel Torres', email: 'gabriel.t@email.com', phone: '(787) 555-9001', position: 'Sales Agent', stage: 'interview', appliedDate: d(-5), notes: 'Experiencia en bienes raíces, 3 años.', rating: 4 },
  { id: 'cand-2', name: 'Sofía Ramírez', email: 'sofia.r@email.com', phone: '(787) 555-9002', position: 'Sales Agent', stage: 'screened', appliedDate: d(-3), notes: 'Sin experiencia directa pero muy motivada.', rating: 3 },
  { id: 'cand-3', name: 'Daniel Colón', email: 'daniel.c@email.com', phone: '(787) 555-9003', position: 'Marketing Specialist', stage: 'applied', appliedDate: d(-1), notes: 'Background en marketing digital.', rating: 0 },
  { id: 'cand-4', name: 'Natalia Ruiz', email: 'natalia.r@email.com', phone: '(787) 555-9004', position: 'Sales Agent', stage: 'offer', appliedDate: d(-15), notes: 'Excelente entrevista. Oferta enviada $50k.', rating: 5 },
  { id: 'cand-5', name: 'Marcos López', email: 'marcos.l@email.com', phone: '(787) 555-9005', position: 'Junior Agent', stage: 'applied', appliedDate: d(-2), notes: 'Recién graduado, interesado en real estate.', rating: 0 },
  { id: 'cand-6', name: 'Patricia Silva', email: 'patricia.s@email.com', phone: '(787) 555-9006', position: 'Operations Coordinator', stage: 'hired', appliedDate: d(-30), notes: 'Contratada. Inicia el 1 de abril.', rating: 5 },
  { id: 'cand-7', name: 'José Martínez', email: 'jose.m@email.com', phone: '(787) 555-9007', position: 'Sales Agent', stage: 'screened', appliedDate: d(-4), notes: 'Licencia de bienes raíces activa.', rating: 4 },
  { id: 'cand-8', name: 'Elena Castro', email: 'elena.c@email.com', phone: '(787) 555-9008', position: 'Finance Analyst', stage: 'interview', appliedDate: d(-7), notes: 'CPA con experiencia en real estate.', rating: 4 },
];

const mockBenefitPlans: BenefitPlan[] = [
  {
    id: 'bp-1', type: 'health', name: 'Premium Health PPO', provider: 'Triple-S Salud',
    description: 'Plan PPO completo con amplia red de proveedores en Puerto Rico y EE.UU.',
    monthlyCost: 650, employerContribution: 470, employeeContribution: 180, coverage: 'Employee + Family',
    deductible: 1500, enrolledCount: 6,
    features: ['Red amplia de proveedores', 'Sin referidos necesarios para especialistas', 'Cobertura de emergencia fuera de red', 'Telemedicina incluida', 'Cobertura de medicamentos recetados', 'Salud mental y behavioral health'],
  },
  {
    id: 'bp-2', type: 'health', name: 'Standard Health HMO', provider: 'Triple-S Salud',
    description: 'Plan HMO económico con red selecta de proveedores.',
    monthlyCost: 420, employerContribution: 300, employeeContribution: 120, coverage: 'Employee Only',
    deductible: 2500, enrolledCount: 4,
    features: ['Costos mensuales más bajos', 'Red selecta de proveedores', 'Copagos predecibles', 'Programas de bienestar', 'Telemedicina incluida'],
  },
  {
    id: 'bp-3', type: 'dental', name: 'Delta Dental Premier', provider: 'Delta Dental',
    description: 'Cobertura dental completa incluyendo ortodoncia.',
    monthlyCost: 55, employerContribution: 30, employeeContribution: 25, coverage: 'Employee + Family',
    deductible: 50, enrolledCount: 7,
    features: ['Preventivo 100% cubierto', 'Básico 80% cubierto', 'Mayor 50% cubierto', 'Ortodoncia para dependientes', 'Máximo anual $2,000'],
  },
  {
    id: 'bp-4', type: 'dental', name: 'Delta Dental Basic', provider: 'Delta Dental',
    description: 'Cobertura dental básica para servicios preventivos y restaurativos.',
    monthlyCost: 30, employerContribution: 15, employeeContribution: 15, coverage: 'Employee Only',
    deductible: 75, enrolledCount: 2,
    features: ['Preventivo 100% cubierto', 'Básico 70% cubierto', 'Máximo anual $1,000'],
  },
  {
    id: 'bp-5', type: 'vision', name: 'VSP Vision Choice', provider: 'VSP',
    description: 'Cobertura de visión para exámenes, lentes y monturas.',
    monthlyCost: 22, employerContribution: 10, employeeContribution: 12, coverage: 'Employee + Family',
    enrolledCount: 4,
    features: ['Examen anual cubierto', 'Allowance de $200 para monturas', 'Descuento en lentes de contacto', 'Descuento en cirugía LASIK'],
  },
  {
    id: 'bp-6', type: 'life', name: 'Term Life Insurance', provider: 'MetLife',
    description: 'Seguro de vida a término por 2x el salario anual.',
    monthlyCost: 18, employerContribution: 0, employeeContribution: 18, coverage: '2x Annual Salary',
    enrolledCount: 1,
    features: ['Cobertura 2x salario anual', 'Muerte accidental y desmembramiento (AD&D)', 'Portabilidad al terminar empleo', 'Beneficiario designable'],
  },
  {
    id: 'bp-7', type: '401k', name: '401(k) Retirement Plan', provider: 'Fidelity',
    description: 'Plan de retiro con match del empleador hasta 4%.',
    monthlyCost: 0, employerContribution: 0, employeeContribution: 0, coverage: 'Variable - Employee Contribution',
    enrolledCount: 3,
    features: ['Match del empleador hasta 4%', 'Vesting inmediato', 'Opciones de inversión diversificadas', 'Préstamos del plan disponibles', 'Contribución Roth disponible', 'Asesoría financiera gratuita'],
  },
  {
    id: 'bp-8', type: 'disability', name: 'Short-Term Disability', provider: 'Unum',
    description: 'Ingreso de reemplazo durante incapacidad temporal.',
    monthlyCost: 22, employerContribution: 0, employeeContribution: 22, coverage: '60% of Salary',
    enrolledCount: 1,
    features: ['60% del salario base', 'Período de espera de 14 días', 'Duración máxima de 26 semanas', 'Incluye embarazo/parto'],
  },
];

const mockTimeOffRequests: TimeOffRequest[] = [
  { id: 'pto-1', employeeId: 'emp-2', employeeName: 'Carlos Reyes', employeeAvatar: 'CR', type: 'vacation', startDate: d(5), endDate: d(9), totalDays: 5, status: 'pending', reason: 'Vacaciones familiares en Vieques', createdAt: d(-2), department: 'Sales' },
  { id: 'pto-2', employeeId: 'emp-5', employeeName: 'Pedro Ortiz', employeeAvatar: 'PO', type: 'personal', startDate: d(3), endDate: d(3), totalDays: 1, status: 'approved', reason: 'Cita médica', approvedBy: 'María Santos', createdAt: d(-5), department: 'Marketing' },
  { id: 'pto-3', employeeId: 'emp-7', employeeName: 'Roberto Vega', employeeAvatar: 'RV', type: 'sick', startDate: d(-10), endDate: d(-6), totalDays: 5, status: 'approved', reason: 'Cirugía de rodilla - reposo médico', approvedBy: 'María Santos', createdAt: d(-12), department: 'Technology' },
  { id: 'pto-4', employeeId: 'emp-3', employeeName: 'Juan Delgado', employeeAvatar: 'JD', type: 'vacation', startDate: d(15), endDate: d(19), totalDays: 5, status: 'pending', reason: 'Viaje a República Dominicana', createdAt: d(-1), department: 'Sales' },
  { id: 'pto-5', employeeId: 'emp-6', employeeName: 'Laura Méndez', employeeAvatar: 'LM', type: 'personal', startDate: d(-3), endDate: d(-3), totalDays: 1, status: 'approved', reason: 'Asuntos personales', approvedBy: 'María Santos', createdAt: d(-7), department: 'Finance' },
  { id: 'pto-6', employeeId: 'emp-4', employeeName: 'Ana Rodríguez', employeeAvatar: 'AR', type: 'vacation', startDate: d(25), endDate: d(29), totalDays: 5, status: 'pending', reason: 'Vacaciones de primavera', createdAt: d(0), department: 'Sales' },
  { id: 'pto-7', employeeId: 'emp-9', employeeName: 'Diego Martínez', employeeAvatar: 'DM', type: 'sick', startDate: d(-1), endDate: d(-1), totalDays: 1, status: 'approved', reason: 'Gripe', approvedBy: 'Carmen Flores', createdAt: d(-1), department: 'Sales' },
  { id: 'pto-8', employeeId: 'emp-8', employeeName: 'Carmen Flores', employeeAvatar: 'CF', type: 'vacation', startDate: d(10), endDate: d(12), totalDays: 3, status: 'approved', reason: 'Fin de semana largo', approvedBy: 'María Santos', createdAt: d(-8), department: 'HR' },
];

const mockAttendance: AttendanceRecord[] = [
  { id: 'att-1', employeeId: 'emp-1', employeeName: 'María Santos', date: d(0), clockIn: '08:00', clockOut: '17:30', hoursWorked: 9.5, status: 'present' },
  { id: 'att-2', employeeId: 'emp-2', employeeName: 'Carlos Reyes', date: d(0), clockIn: '08:15', clockOut: '17:00', hoursWorked: 8.75, status: 'present' },
  { id: 'att-3', employeeId: 'emp-3', employeeName: 'Juan Delgado', date: d(0), clockIn: '09:10', clockOut: '17:30', hoursWorked: 8.33, status: 'late', notes: 'Tráfico en PR-22' },
  { id: 'att-4', employeeId: 'emp-4', employeeName: 'Ana Rodríguez', date: d(0), clockIn: '08:00', clockOut: '12:00', hoursWorked: 4, status: 'half-day', notes: 'Cita médica PM' },
  { id: 'att-5', employeeId: 'emp-5', employeeName: 'Pedro Ortiz', date: d(0), clockIn: '08:30', clockOut: '17:00', hoursWorked: 8.5, status: 'remote' },
  { id: 'att-6', employeeId: 'emp-6', employeeName: 'Laura Méndez', date: d(0), clockIn: '07:45', clockOut: '17:15', hoursWorked: 9.5, status: 'present' },
  { id: 'att-7', employeeId: 'emp-7', employeeName: 'Roberto Vega', date: d(0), clockIn: '', hoursWorked: 0, status: 'absent', notes: 'Licencia médica' },
  { id: 'att-8', employeeId: 'emp-8', employeeName: 'Carmen Flores', date: d(0), clockIn: '08:00', clockOut: '17:00', hoursWorked: 9, status: 'present' },
  { id: 'att-9', employeeId: 'emp-9', employeeName: 'Diego Martínez', date: d(0), clockIn: '08:05', clockOut: '17:30', hoursWorked: 9.42, status: 'present' },
  { id: 'att-10', employeeId: 'emp-10', employeeName: 'Isabel Cruz', date: d(0), clockIn: '08:00', clockOut: '17:00', hoursWorked: 9, status: 'present' },
  { id: 'att-11', employeeId: 'emp-1', employeeName: 'María Santos', date: d(-1), clockIn: '08:00', clockOut: '18:00', hoursWorked: 10, status: 'present' },
  { id: 'att-12', employeeId: 'emp-2', employeeName: 'Carlos Reyes', date: d(-1), clockIn: '08:00', clockOut: '17:00', hoursWorked: 9, status: 'present' },
  { id: 'att-13', employeeId: 'emp-3', employeeName: 'Juan Delgado', date: d(-1), clockIn: '08:00', clockOut: '17:00', hoursWorked: 9, status: 'present' },
  { id: 'att-14', employeeId: 'emp-5', employeeName: 'Pedro Ortiz', date: d(-1), clockIn: '09:00', clockOut: '17:00', hoursWorked: 8, status: 'remote' },
];

const mockPerformanceReviews: PerformanceReview[] = [
  {
    id: 'rev-1', employeeId: 'emp-2', employeeName: 'Carlos Reyes', employeeAvatar: 'CR', reviewerId: 'emp-1', reviewerName: 'María Santos', cycle: 'annual', period: '2025', overallRating: 4.2, status: 'completed',
    categories: [
      { name: 'Productividad', rating: 4.5, weight: 25, comments: 'Superó metas de cierre consistentemente.' },
      { name: 'Calidad de Trabajo', rating: 4.0, weight: 25, comments: 'Documentación de deals excelente.' },
      { name: 'Trabajo en Equipo', rating: 4.0, weight: 20, comments: 'Mentoring efectivo a agentes junior.' },
      { name: 'Comunicación', rating: 4.5, weight: 15, comments: 'Excelente relación con clientes y equipo.' },
      { name: 'Iniciativa', rating: 4.0, weight: 15, comments: 'Propuso nuevo proceso de evaluación.' },
    ],
    strengths: ['Habilidad de negociación excepcional', 'Consistencia en resultados', 'Liderazgo natural'],
    improvements: ['Documentación de procesos internos', 'Delegación de tareas'],
    goals: [
      { id: 'g-1', title: 'Cerrar 24 deals en 2026', description: 'Aumentar cierres de 18 a 24 deals anuales.', targetDate: d(270), status: 'in-progress', progress: 25 },
      { id: 'g-2', title: 'Mentorar 2 agentes junior', description: 'Guiar a Ana y un nuevo agente durante Q1-Q2.', targetDate: d(180), status: 'in-progress', progress: 50 },
      { id: 'g-3', title: 'Obtener certificación GRI', description: 'Completar Graduate REALTOR Institute.', targetDate: d(300), status: 'not-started', progress: 0 },
    ],
    comments: 'Carlos ha demostrado un rendimiento sobresaliente. Su capacidad de negociación y liderazgo son activos clave del equipo. Recomendamos promoción a Team Lead.', createdAt: d(-60), completedAt: d(-45),
  },
  {
    id: 'rev-2', employeeId: 'emp-4', employeeName: 'Ana Rodríguez', employeeAvatar: 'AR', reviewerId: 'emp-2', reviewerName: 'Carlos Reyes', cycle: 'probation', period: 'Q4 2025', overallRating: 3.5, status: 'completed',
    categories: [
      { name: 'Productividad', rating: 3.0, weight: 25, comments: 'En camino a cumplir metas de período probatorio.' },
      { name: 'Calidad de Trabajo', rating: 3.5, weight: 25, comments: 'Necesita mejorar en documentación.' },
      { name: 'Trabajo en Equipo', rating: 4.0, weight: 20, comments: 'Colabora bien con el equipo.' },
      { name: 'Comunicación', rating: 3.5, weight: 15, comments: 'Buena comunicación con clientes.' },
      { name: 'Aprendizaje', rating: 4.0, weight: 15, comments: 'Absorbe conocimiento rápidamente.' },
    ],
    strengths: ['Actitud positiva y motivación', 'Rápido aprendizaje', 'Buena relación con clientes'],
    improvements: ['Conocimiento del mercado local', 'Técnicas de cierre', 'Gestión de tiempo'],
    goals: [
      { id: 'g-4', title: 'Completar training de CRM', description: 'Dominar todas las funciones del sistema.', targetDate: d(30), status: 'in-progress', progress: 70 },
      { id: 'g-5', title: 'Cerrar primer deal independiente', description: 'Completar un deal sin supervisión directa.', targetDate: d(60), status: 'not-started', progress: 0 },
    ],
    comments: 'Ana muestra gran potencial. Su actitud y disposición para aprender son ejemplares. Necesita más experiencia práctica en el mercado.', createdAt: d(-30), completedAt: d(-20),
  },
  {
    id: 'rev-3', employeeId: 'emp-5', employeeName: 'Pedro Ortiz', employeeAvatar: 'PO', reviewerId: 'emp-1', reviewerName: 'María Santos', cycle: 'semi-annual', period: 'H2 2025', overallRating: 4.0, status: 'completed',
    categories: [
      { name: 'Productividad', rating: 4.0, weight: 25, comments: 'Ejecutó todas las campañas en tiempo.' },
      { name: 'Creatividad', rating: 4.5, weight: 25, comments: 'Ideas frescas para contenido y campañas.' },
      { name: 'Análisis de Datos', rating: 3.5, weight: 20, comments: 'Mejorando en análisis de ROI.' },
      { name: 'Comunicación', rating: 4.0, weight: 15, comments: 'Buen trabajo con proveedores externos.' },
      { name: 'Adaptabilidad', rating: 4.0, weight: 15, comments: 'Se adaptó bien a nuevas plataformas.' },
    ],
    strengths: ['Creatividad en campañas', 'Conocimiento de redes sociales', 'Proactividad'],
    improvements: ['Análisis de métricas avanzadas', 'Presupuestación de campañas'],
    goals: [
      { id: 'g-6', title: 'Reducir CPL en 20%', description: 'Optimizar campañas para reducir costo por lead.', targetDate: d(180), status: 'in-progress', progress: 35 },
      { id: 'g-7', title: 'Lanzar canal de YouTube', description: 'Crear contenido de video para la marca.', targetDate: d(120), status: 'not-started', progress: 0 },
    ],
    comments: 'Pedro ha elevado significativamente la presencia digital de la empresa. Su creatividad es un activo valioso.', createdAt: d(-45), completedAt: d(-30),
  },
  {
    id: 'rev-4', employeeId: 'emp-3', employeeName: 'Juan Delgado', employeeAvatar: 'JD', reviewerId: 'emp-2', reviewerName: 'Carlos Reyes', cycle: 'annual', period: '2025', overallRating: 3.8, status: 'in-progress',
    categories: [
      { name: 'Productividad', rating: 3.5, weight: 25, comments: '' },
      { name: 'Calidad de Trabajo', rating: 4.0, weight: 25, comments: '' },
      { name: 'Trabajo en Equipo', rating: 4.0, weight: 20, comments: '' },
      { name: 'Comunicación', rating: 3.5, weight: 15, comments: '' },
      { name: 'Iniciativa', rating: 4.0, weight: 15, comments: '' },
    ],
    strengths: ['Persistencia con leads difíciles', 'Conocimiento del mercado'],
    improvements: ['Puntualidad', 'Documentación de actividades'],
    goals: [
      { id: 'g-8', title: 'Mejorar tasa de conversión', description: 'Aumentar conversión de contacted a qualified.', targetDate: d(200), status: 'not-started', progress: 0 },
    ],
    comments: '', createdAt: d(-5),
  },
];

const mockCompanyPolicies: CompanyPolicy[] = [
  {
    id: 'pol-1', title: 'Manual del Empleado', category: 'general',
    description: 'Guía completa de políticas, procedimientos y expectativas para todos los empleados.',
    effectiveDate: '2025-01-01', lastUpdated: '2026-01-15', version: '3.2', acknowledgments: 9, totalEmployees: 10,
    content: `## Manual del Empleado - My House Realty

### 1. Bienvenida
Bienvenido a My House Realty. Esta guía establece las políticas y procedimientos que rigen nuestra relación laboral.

### 2. Horario de Trabajo
- Horario estándar: Lunes a Viernes, 8:00 AM - 5:00 PM
- Hora de almuerzo: 12:00 PM - 1:00 PM (1 hora)
- Se permite flexibilidad de 15 minutos en la entrada
- Trabajo remoto disponible con aprobación del supervisor

### 3. Código de Vestimenta
- Business casual de lunes a jueves
- Casual los viernes
- Vestimenta profesional para reuniones con clientes y eventos

### 4. Período Probatorio
- 90 días para nuevos empleados
- Evaluación formal al final del período
- Extensión posible hasta 180 días si es necesario`,
  },
  {
    id: 'pol-2', title: 'Código de Conducta Profesional', category: 'conduct',
    description: 'Estándares de comportamiento ético y profesional esperados de todos los miembros del equipo.',
    effectiveDate: '2025-01-01', lastUpdated: '2025-06-01', version: '2.1', acknowledgments: 10, totalEmployees: 10,
    content: `## Código de Conducta Profesional

### Principios Fundamentales
1. **Integridad**: Actuar con honestidad en todas las interacciones
2. **Respeto**: Tratar a todos con dignidad y respeto
3. **Confidencialidad**: Proteger información de clientes y la empresa
4. **Profesionalismo**: Mantener estándares altos en todo momento

### Conflictos de Interés
- No participar en transacciones donde exista conflicto personal
- Declarar cualquier relación previa con clientes o propiedades
- No aceptar regalos de valor superior a $50 de clientes o proveedores

### Uso de Tecnología
- Los equipos de la empresa son para uso profesional
- No instalar software no autorizado
- Reportar incidentes de seguridad inmediatamente
- Proteger credenciales de acceso al sistema`,
  },
  {
    id: 'pol-3', title: 'Política de Beneficios', category: 'benefits',
    description: 'Detalle de todos los beneficios disponibles, elegibilidad y proceso de inscripción.',
    effectiveDate: '2026-01-01', lastUpdated: '2026-01-01', version: '4.0', acknowledgments: 8, totalEmployees: 10,
    content: `## Política de Beneficios 2026

### Elegibilidad
- Empleados a tiempo completo (30+ horas/semana)
- Beneficios comienzan el primer día del mes siguiente a la contratación
- Open enrollment anual en noviembre

### Planes de Salud
- PPO Premium (Triple-S): Mayor flexibilidad, red amplia
- HMO Standard (Triple-S): Costos más bajos, red selecta

### Beneficios Adicionales
- Dental (Delta Dental Premier/Basic)
- Visión (VSP)
- Seguro de Vida (MetLife)
- 401(k) con match hasta 4%
- Incapacidad a corto plazo (Unum)

### Tiempo Libre
- 15 días de vacaciones anuales
- 10 días de enfermedad
- 3 días personales
- Días feriados de PR según calendario oficial`,
  },
  {
    id: 'pol-4', title: 'Política de Seguridad en el Trabajo', category: 'safety',
    description: 'Protocolos de seguridad para oficina y visitas a propiedades.',
    effectiveDate: '2025-03-01', lastUpdated: '2025-12-01', version: '2.0', acknowledgments: 10, totalEmployees: 10,
    content: `## Política de Seguridad

### Seguridad en Oficina
- Mantener áreas de trabajo organizadas
- Reportar condiciones inseguras al supervisor
- Conocer rutas de evacuación y puntos de reunión
- Botiquín de primeros auxilios en el área de recepción

### Seguridad en Visitas a Propiedades
- Siempre informar la ubicación al equipo
- Llevar teléfono cargado con GPS activo
- No visitar propiedades solo/a en horarios nocturnos
- Verificar identidad de los clientes antes de reuniones presenciales
- Compartir itinerario con un compañero de trabajo

### Protocolo de Huracanes
- Seguir instrucciones de la Agencia de Manejo de Emergencias
- Asegurar equipos y documentos importantes
- Plan de trabajo remoto durante eventos climáticos`,
  },
  {
    id: 'pol-5', title: 'Política de Uso de Tecnología', category: 'technology',
    description: 'Lineamientos para el uso correcto de sistemas, equipos y datos de la empresa.',
    effectiveDate: '2025-06-01', lastUpdated: '2026-02-01', version: '3.0', acknowledgments: 10, totalEmployees: 10,
    content: `## Política de Uso de Tecnología

### Sistemas de la Empresa
- El CRM Seller Lead Engine™ es la herramienta principal de trabajo
- Todos los leads deben registrarse en el sistema
- Mantener información actualizada y completa

### Contraseñas y Acceso
- Contraseñas mínimo 12 caracteres con caracteres especiales
- Cambio obligatorio cada 90 días
- No compartir credenciales
- Activar autenticación de dos factores (2FA)

### Datos y Privacidad
- Cumplir con LGPD/CCPA según aplique
- No compartir datos de clientes fuera del sistema
- Reportar brechas de seguridad inmediatamente
- Usar solo canales aprobados para comunicación con clientes`,
  },
  {
    id: 'pol-6', title: 'Política de Cumplimiento Inmobiliario', category: 'compliance',
    description: 'Regulaciones y cumplimiento legal para operaciones de bienes raíces en Puerto Rico.',
    effectiveDate: '2025-01-01', lastUpdated: '2026-01-01', version: '2.5', acknowledgments: 7, totalEmployees: 10,
    content: `## Cumplimiento Inmobiliario - Puerto Rico

### Licencias Requeridas
- Licencia de corredor/vendedor de bienes raíces de PR
- Educación continua: 30 horas cada 3 años
- Verificación anual de licencia activa

### Leyes Aplicables
- Ley de Corredores de Bienes Raíces de PR
- Fair Housing Act
- RESPA (Real Estate Settlement Procedures Act)
- Ley CRIM y contribuciones sobre la propiedad

### Documentación Requerida
- Contrato de listado firmado por todas las partes
- Divulgación de condición de la propiedad
- Informe de tasación cuando aplique
- Certificación de CRIM al día

### Anti-Lavado de Dinero
- KYC (Know Your Customer) para todas las transacciones
- Reportar transacciones sospechosas
- No aceptar pagos en efectivo superiores a $10,000`,
  },
  {
    id: 'pol-7', title: 'Política de Licencias y Ausencias', category: 'leave',
    description: 'Tipos de licencias disponibles, proceso de solicitud y aprobación.',
    effectiveDate: '2025-01-01', lastUpdated: '2025-12-01', version: '2.0', acknowledgments: 10, totalEmployees: 10,
    content: `## Política de Licencias y Ausencias

### Vacaciones
- 15 días anuales (acumulación: 1.25 días/mes)
- Solicitar con mínimo 2 semanas de anticipación
- Máximo 10 días consecutivos sin aprobación especial
- No se acumulan más de 30 días

### Enfermedad
- 10 días anuales
- Certificado médico requerido para 3+ días consecutivos
- No se acumulan de año a año

### Días Personales
- 3 días anuales
- Solicitar con mínimo 48 horas de anticipación

### Licencias Especiales
- Maternidad: 8 semanas con pago completo
- Paternidad: 2 semanas con pago completo
- Duelo: 3-5 días según parentesco
- Jurado: Según duración del servicio con pago completo`,
  },
];

const mockOrgChart: OrgNode[] = [
  { id: 'emp-1', name: 'María Santos', role: 'Director General', department: 'Operations', avatar: 'MS', directReports: 5 },
  { id: 'emp-2', name: 'Carlos Reyes', role: 'Senior Sales Agent', department: 'Sales', avatar: 'CR', managerId: 'emp-1', directReports: 3 },
  { id: 'emp-3', name: 'Juan Delgado', role: 'Sales Agent', department: 'Sales', avatar: 'JD', managerId: 'emp-2', directReports: 0 },
  { id: 'emp-4', name: 'Ana Rodríguez', role: 'Junior Agent', department: 'Sales', avatar: 'AR', managerId: 'emp-2', directReports: 0 },
  { id: 'emp-9', name: 'Diego Martínez', role: 'Sales Agent', department: 'Sales', avatar: 'DM', managerId: 'emp-2', directReports: 0 },
  { id: 'emp-5', name: 'Pedro Ortiz', role: 'Marketing Coordinator', department: 'Marketing', avatar: 'PO', managerId: 'emp-1', directReports: 0 },
  { id: 'emp-6', name: 'Laura Méndez', role: 'Finance Manager', department: 'Finance', avatar: 'LM', managerId: 'emp-1', directReports: 0 },
  { id: 'emp-7', name: 'Roberto Vega', role: 'IT Specialist', department: 'Technology', avatar: 'RV', managerId: 'emp-1', directReports: 0 },
  { id: 'emp-8', name: 'Carmen Flores', role: 'HR Coordinator', department: 'HR', avatar: 'CF', managerId: 'emp-1', directReports: 0 },
  { id: 'emp-10', name: 'Isabel Cruz', role: 'Administrative Assistant', department: 'Operations', avatar: 'IC', managerId: 'emp-1', directReports: 0 },
];

export const hrService = {
  async getEmployees(): Promise<Employee[]> {
    await delay(300);
    return [...mockEmployees];
  },
  async getEmployee(id: string): Promise<Employee | undefined> {
    await delay(200);
    return mockEmployees.find(e => e.id === id);
  },
  async getCandidates(): Promise<Candidate[]> {
    await delay(250);
    return [...mockCandidates];
  },
  async updateCandidateStage(id: string, stage: HiringStage): Promise<Candidate | undefined> {
    await delay(300);
    const idx = mockCandidates.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    mockCandidates[idx] = { ...mockCandidates[idx], stage };
    return mockCandidates[idx];
  },
  async getBenefitPlans(): Promise<BenefitPlan[]> {
    await delay(250);
    return [...mockBenefitPlans];
  },
  async getTimeOffRequests(): Promise<TimeOffRequest[]> {
    await delay(250);
    return [...mockTimeOffRequests];
  },
  async updateTimeOffStatus(id: string, status: 'approved' | 'denied'): Promise<TimeOffRequest | undefined> {
    await delay(300);
    const idx = mockTimeOffRequests.findIndex(r => r.id === id);
    if (idx === -1) return undefined;
    mockTimeOffRequests[idx] = { ...mockTimeOffRequests[idx], status, approvedBy: status === 'approved' ? 'María Santos' : undefined };
    return mockTimeOffRequests[idx];
  },
  async getAttendance(): Promise<AttendanceRecord[]> {
    await delay(250);
    return [...mockAttendance];
  },
  async getPerformanceReviews(): Promise<PerformanceReview[]> {
    await delay(300);
    return [...mockPerformanceReviews];
  },
  async getCompanyPolicies(): Promise<CompanyPolicy[]> {
    await delay(250);
    return [...mockCompanyPolicies];
  },
  async getOrgChart(): Promise<OrgNode[]> {
    await delay(200);
    return [...mockOrgChart];
  },
};
