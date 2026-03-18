export type CalendarView = 'day' | 'week' | 'month' | 'agenda';
export type EventType = 'property-viewing' | 'seller-meeting' | 'follow-up' | 'evaluation' | 'closing' | 'team-meeting' | 'other';

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  startDate: string;
  endDate: string;
  allDay: boolean;
  location?: string;
  description?: string;
  attendees: string[];
  leadId?: string;
  leadName?: string;
  owner: string;
  color: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
  reminderMinutes: number;
  createdAt: string;
}

export interface AvailabilitySlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface CalendarIntegration {
  provider: 'google' | 'outlook' | 'apple';
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'coming-soon';
  lastSync?: string;
  email?: string;
}

export type BookingStatus = 'upcoming' | 'completed' | 'canceled' | 'no-show';

export interface BookingEventType {
  id: string;
  name: string;
  slug: string;
  duration: number;
  color: string;
  description: string;
  location: string;
  isActive: boolean;
  bufferBefore: number;
  bufferAfter: number;
  maxPerDay: number;
}

export interface Booking {
  id: string;
  eventTypeId: string;
  eventTypeName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  status: BookingStatus;
  notes?: string;
  leadId?: string;
  owner: string;
  location: string;
  createdAt: string;
  canceledAt?: string;
  cancelReason?: string;
}

export type MeetingProvider = 'zoom' | 'google-meet' | 'teams' | 'whatsapp' | 'phone' | 'in-person';
export type MeetingStatus = 'scheduled' | 'in-progress' | 'completed' | 'canceled' | 'no-show';
export type MeetingOutcome = 'positive' | 'neutral' | 'negative' | 'follow-up-needed' | 'closed-won' | 'closed-lost' | null;

export interface Meeting {
  id: string;
  title: string;
  provider: MeetingProvider;
  status: MeetingStatus;
  outcome: MeetingOutcome;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  meetingLink?: string;
  location?: string;
  attendees: { name: string; email: string; role: string }[];
  leadId?: string;
  leadName?: string;
  clientId?: string;
  clientName?: string;
  agenda?: string;
  notes?: string;
  owner: string;
  recordingUrl?: string;
  outcomeNotes?: string;
  createdAt: string;
  activities: MeetingActivity[];
}

export interface MeetingActivity {
  id: string;
  action: string;
  date: string;
  author: string;
}

export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'refunded' | 'overdue';
export type PaymentMethod = 'stripe' | 'square' | 'paypal' | 'ach' | 'cash' | 'check' | 'quickbooks';

export interface Transaction {
  id: string;
  amount: number;
  status: TransactionStatus;
  method: PaymentMethod;
  description: string;
  clientName: string;
  clientId?: string;
  invoiceId?: string;
  proposalId?: string;
  date: string;
  dueDate?: string;
  memo?: string;
  paymentTerms?: string;
  reminderSent: boolean;
  createdAt: string;
  timeline: TransactionTimelineEntry[];
}

export interface TransactionTimelineEntry {
  id: string;
  action: string;
  date: string;
  author: string;
}

export interface BillingMetrics {
  totalBilled: number;
  collected: number;
  pending: number;
  overdue: number;
}

export type PaymentProvider = {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'coming-soon';
  description: string;
};

export type ProposalStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';

export interface ProposalBlock {
  id: string;
  type: 'cover' | 'intro' | 'problem' | 'solution' | 'scope' | 'deliverables' | 'timeline' | 'pricing' | 'chart' | 'gallery' | 'testimonials' | 'terms' | 'signature';
  title: string;
  content: any;
  order: number;
}

export interface Proposal {
  id: string;
  title: string;
  status: ProposalStatus;
  clientName: string;
  clientId?: string;
  leadId?: string;
  totalValue: number;
  createdAt: string;
  sentAt?: string;
  viewedAt?: string;
  respondedAt?: string;
  expiresAt: string;
  blocks: ProposalBlock[];
  templateId?: string;
  version: number;
  owner: string;
  linkedInvoiceId?: string;
  linkedPaymentId?: string;
  viewCount: number;
  lastViewedAt?: string;
}

export interface ProposalTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  blocks: ProposalBlock[];
  createdAt: string;
  usageCount: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'partially-paid' | 'overdue' | 'canceled' | 'void';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  number: string;
  status: InvoiceStatus;
  clientName: string;
  clientEmail: string;
  clientId?: string;
  proposalId?: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  memo?: string;
  terms?: string;
  paymentMethods: PaymentMethod[];
  owner: string;
  createdAt: string;
  payments: InvoicePayment[];
}

export interface InvoicePayment {
  id: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  reference: string;
}

export interface Receipt {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  reference: string;
}

export type DocumentCategory = 'contracts' | 'proposals' | 'invoices' | 'photos' | 'inspections' | 'legal' | 'sops' | 'templates' | 'scripts' | 'marketing' | 'other';

export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  category: DocumentCategory;
  folder: string;
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
  updatedAt: string;
  leadId?: string;
  leadName?: string;
  clientId?: string;
  clientName?: string;
  version: number;
  isInternal: boolean;
  previewUrl?: string;
  downloadUrl?: string;
  permissions: string[];
}

export interface DocumentFolder {
  id: string;
  name: string;
  parentId?: string;
  documentCount: number;
  isInternal: boolean;
}

export type StorageProvider = {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'coming-soon';
  description: string;
  spaceUsed?: string;
  spaceTotal?: string;
};

export type ClientType = 'lead' | 'prospect' | 'client' | 'past-client';

export interface ClientRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: ClientType;
  company?: string;
  address?: string;
  municipality?: string;
  region?: string;
  leadId?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  totalProposals: number;
  totalInvoices: number;
  totalMeetings: number;
  totalDocuments: number;
  outstandingBalance: number;
  totalRevenue: number;
  tags: string[];
  notes: string;
  timeline: ClientTimelineEntry[];
  lifecycleStage: number;
}

export interface ClientTimelineEntry {
  id: string;
  type: 'note' | 'meeting' | 'proposal' | 'invoice' | 'document' | 'status-change' | 'call' | 'email' | 'payment';
  title: string;
  description: string;
  date: string;
  author: string;
  linkedId?: string;
}

export type IntegrationCategory = 'calendar' | 'meetings' | 'payments' | 'storage' | 'automation' | 'communications' | 'crm' | 'marketing';
export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'coming-soon';

export interface IntegrationConnection {
  id: string;
  name: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  description: string;
  benefits: string[];
  requiredPermissions: string[];
  icon: string;
  lastSync?: string;
  connectedAt?: string;
  logs: IntegrationLog[];
  configUrl?: string;
}

export interface IntegrationLog {
  id: string;
  action: string;
  status: 'success' | 'error' | 'warning';
  date: string;
  details: string;
}

export type TemplateCategory = 'proposals' | 'invoices' | 'emails' | 'whatsapp' | 'meetings' | 'quotes';

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  content: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  isDefault: boolean;
  owner: string;
}

export interface OperationsActivity {
  id: string;
  type: 'booking-confirmed' | 'invoice-generated' | 'payment-received' | 'file-uploaded' | 'proposal-sent' | 'meeting-scheduled' | 'client-created' | 'integration-connected' | 'template-created';
  title: string;
  description: string;
  date: string;
  author: string;
  linkedType?: string;
  linkedId?: string;
}

export type FormFieldType = 'text' | 'long-text' | 'number' | 'phone' | 'email' | 'dropdown' | 'multi-select' | 'radio' | 'checkbox' | 'date' | 'file-upload';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder: string;
  required: boolean;
  active: boolean;
  options?: FormFieldOption[];
  validation?: string;
  order: number;
}

export type FormStatus = 'active' | 'inactive' | 'draft';

export interface FormDefinition {
  id: string;
  name: string;
  description: string;
  status: FormStatus;
  fields: FormField[];
  submissions: number;
  createdAt: string;
  updatedAt: string;
  owner: string;
  embedCode?: string;
  landingTitle?: string;
  landingInstructions?: string;
  landingBgColor?: string;
}

export interface LearningSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessonCount: number;
  completedCount: number;
}

export interface Lesson {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  completed: boolean;
  videoUrl?: string;
  content: string;
  order: number;
}

export type EmployeeStatus = 'active' | 'on-leave' | 'terminated';
export type Department = 'Sales' | 'Operations' | 'Marketing' | 'Finance' | 'HR' | 'Technology';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: Department;
  hireDate: string;
  status: EmployeeStatus;
  avatar: string;
  salary: number;
  address?: string;
  emergencyContact?: string;
  dateOfBirth?: string;
  ssn?: string;
  manager?: string;
  payrollHistory: PayrollEntry[];
  benefits?: EmployeeBenefit[];
  ptoBalance?: PTOBalance;
  performanceRating?: number;
}

export interface PayrollEntry {
  id: string;
  period: string;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: 'paid' | 'pending' | 'processing';
  paidDate?: string;
}

export type HiringStage = 'applied' | 'screened' | 'interview' | 'offer' | 'hired';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  stage: HiringStage;
  appliedDate: string;
  resumeUrl?: string;
  notes: string;
  rating: number;
}

export type BenefitType = 'health' | 'dental' | 'vision' | 'life' | '401k' | 'hsa' | 'fsa' | 'disability';

export interface BenefitPlan {
  id: string;
  type: BenefitType;
  name: string;
  provider: string;
  description: string;
  monthlyCost: number;
  employerContribution: number;
  employeeContribution: number;
  coverage: string;
  deductible?: number;
  enrolledCount: number;
  features: string[];
}

export interface EmployeeBenefit {
  planId: string;
  planName: string;
  type: BenefitType;
  enrolledDate: string;
  status: 'active' | 'pending' | 'waived';
  employeeCost: number;
}

export interface PTOBalance {
  vacation: { available: number; used: number; total: number };
  sick: { available: number; used: number; total: number };
  personal: { available: number; used: number; total: number };
}

export type TimeOffStatus = 'approved' | 'pending' | 'denied' | 'canceled';
export type TimeOffType = 'vacation' | 'sick' | 'personal' | 'bereavement' | 'jury-duty' | 'maternity' | 'paternity';

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  type: TimeOffType;
  startDate: string;
  endDate: string;
  totalDays: number;
  status: TimeOffStatus;
  reason: string;
  approvedBy?: string;
  createdAt: string;
  department: Department;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  hoursWorked: number;
  status: 'present' | 'late' | 'absent' | 'half-day' | 'remote';
  notes?: string;
}

export type ReviewCycle = 'annual' | 'semi-annual' | 'quarterly' | 'probation';

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  reviewerId: string;
  reviewerName: string;
  cycle: ReviewCycle;
  period: string;
  overallRating: number;
  status: 'draft' | 'in-progress' | 'completed' | 'acknowledged';
  categories: ReviewCategory[];
  strengths: string[];
  improvements: string[];
  goals: ReviewGoal[];
  comments: string;
  createdAt: string;
  completedAt?: string;
}

export interface ReviewCategory {
  name: string;
  rating: number;
  weight: number;
  comments: string;
}

export interface ReviewGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  progress: number;
}

export interface CompanyPolicy {
  id: string;
  title: string;
  category: 'general' | 'conduct' | 'benefits' | 'safety' | 'technology' | 'compliance' | 'leave';
  description: string;
  content: string;
  effectiveDate: string;
  lastUpdated: string;
  version: string;
  acknowledgments: number;
  totalEmployees: number;
}

export interface OrgNode {
  id: string;
  name: string;
  role: string;
  department: Department;
  avatar: string;
  managerId?: string;
  directReports: number;
}

export type AutomationTriggerType = 'lead-created' | 'lead-score-high' | 'meeting-booked' | 'stage-changed';
export type AutomationActionType = 'send-email' | 'assign-agent' | 'send-notification' | 'add-tag' | 'wait-days';

export type AutomationConditionType = 'score-above' | 'tag-equals' | 'stage-is' | 'property-type' | 'timeline-is';

export interface AutomationNode {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  triggerType?: AutomationTriggerType;
  actionType?: AutomationActionType;
  conditionType?: AutomationConditionType;
  label: string;
  config: Record<string, string>;
  x: number;
  y: number;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  nodes: AutomationNode[];
  connections: { from: string; to: string }[];
  createdAt: string;
  updatedAt: string;
  runCount: number;
  lastRun?: string;
  runHistory: AutomationRunEntry[];
}

export interface AutomationRunEntry {
  id: string;
  date: string;
  trigger: string;
  status: 'success' | 'failed' | 'skipped';
  details: string;
  duration: number;
}
