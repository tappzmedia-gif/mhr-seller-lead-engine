import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input } from "@/components/ui-components";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Users, Search, Building2, Calendar, DollarSign, ChevronLeft, Mail, Phone,
  MapPin, Loader2, UserCheck, Briefcase, Star, Shield, ClipboardList,
  Heart, CalendarOff, TrendingUp, FileText, Network, ChevronRight,
  CheckCircle, XCircle, AlertCircle, Award, Target, Eye, GraduationCap,
  Clock, PlayCircle, StopCircle, Timer
} from "lucide-react";
import { hrService } from "@/lib/services/hrService";
import type {
  Employee, Candidate, Department, HiringStage, EmployeeStatus,
  BenefitPlan, TimeOffRequest, AttendanceRecord, PerformanceReview, CompanyPolicy, OrgNode, BenefitType
} from "@/lib/operations-types";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const STATUS_VARIANTS: Record<EmployeeStatus, any> = {
  active: 'success',
  'on-leave': 'medium',
  terminated: 'destructive',
};
const STATUS_KEYS: Record<EmployeeStatus, string> = {
  active: 'hr.status.active',
  'on-leave': 'hr.status.onLeave',
  terminated: 'hr.status.terminated',
};

const HIRING_STAGES: { key: HiringStage; labelKey: string; color: string }[] = [
  { key: 'applied', labelKey: 'hr.hiring.applied', color: 'bg-slate-100' },
  { key: 'screened', labelKey: 'hr.hiring.screened', color: 'bg-blue-50' },
  { key: 'interview', labelKey: 'hr.hiring.interview', color: 'bg-amber-50' },
  { key: 'offer', labelKey: 'hr.hiring.offer', color: 'bg-purple-50' },
  { key: 'hired', labelKey: 'hr.hiring.hired', color: 'bg-emerald-50' },
];

const PAYROLL_STATUS_VARIANTS: Record<string, any> = {
  paid: 'success',
  pending: 'medium',
  processing: 'secondary',
};
const PAYROLL_STATUS_KEYS: Record<string, string> = {
  paid: 'hr.payroll.paid',
  pending: 'hr.payroll.pending',
  processing: 'hr.payroll.processing',
};

const BENEFIT_ICONS: Record<BenefitType, { icon: string; color: string }> = {
  health: { icon: '🏥', color: 'bg-red-50 border-red-200' },
  dental: { icon: '🦷', color: 'bg-blue-50 border-blue-200' },
  vision: { icon: '👁️', color: 'bg-purple-50 border-purple-200' },
  life: { icon: '🛡️', color: 'bg-emerald-50 border-emerald-200' },
  '401k': { icon: '💰', color: 'bg-amber-50 border-amber-200' },
  hsa: { icon: '🏦', color: 'bg-teal-50 border-teal-200' },
  fsa: { icon: '💳', color: 'bg-indigo-50 border-indigo-200' },
  disability: { icon: '🩺', color: 'bg-orange-50 border-orange-200' },
};

const TIMEOFF_TYPE_CONFIG: Record<string, { labelKey: string; color: string }> = {
  vacation: { labelKey: 'hr.timeoff.type.vacation', color: 'bg-blue-100 text-blue-700' },
  sick: { labelKey: 'hr.timeoff.type.sick', color: 'bg-red-100 text-red-700' },
  personal: { labelKey: 'hr.timeoff.type.personal', color: 'bg-purple-100 text-purple-700' },
  bereavement: { labelKey: 'hr.timeoff.type.bereavement', color: 'bg-slate-100 text-slate-700' },
  'jury-duty': { labelKey: 'hr.timeoff.type.juryDuty', color: 'bg-amber-100 text-amber-700' },
  maternity: { labelKey: 'hr.timeoff.type.maternity', color: 'bg-pink-100 text-pink-700' },
  paternity: { labelKey: 'hr.timeoff.type.paternity', color: 'bg-cyan-100 text-cyan-700' },
};

const TIMEOFF_STATUS_VARIANTS: Record<string, any> = {
  approved: 'success',
  pending: 'medium',
  denied: 'destructive',
  canceled: 'secondary',
};
const TIMEOFF_STATUS_KEYS: Record<string, string> = {
  approved: 'hr.timeoff.status.approved',
  pending: 'hr.timeoff.status.pending',
  denied: 'hr.timeoff.status.denied',
  canceled: 'hr.timeoff.status.canceled',
};

const ATTENDANCE_STATUS_CONFIG: Record<string, { labelKey: string; color: string }> = {
  present: { labelKey: 'hr.attendance.present', color: 'bg-emerald-100 text-emerald-700' },
  late: { labelKey: 'hr.attendance.late', color: 'bg-amber-100 text-amber-700' },
  absent: { labelKey: 'hr.attendance.absent', color: 'bg-red-100 text-red-700' },
  'half-day': { labelKey: 'hr.attendance.halfDay', color: 'bg-blue-100 text-blue-700' },
  remote: { labelKey: 'hr.attendance.remote', color: 'bg-purple-100 text-purple-700' },
};

const POLICY_CATEGORIES: Record<string, { labelKey: string; icon: any }> = {
  general: { labelKey: 'hr.policy.general', icon: FileText },
  conduct: { labelKey: 'hr.policy.conduct', icon: Shield },
  benefits: { labelKey: 'hr.policy.benefits', icon: Heart },
  safety: { labelKey: 'hr.policy.safety', icon: AlertCircle },
  technology: { labelKey: 'hr.policy.technology', icon: Building2 },
  compliance: { labelKey: 'hr.policy.compliance', icon: CheckCircle },
  leave: { labelKey: 'hr.policy.leave', icon: CalendarOff },
};

type HRTab = 'employees' | 'hiring' | 'payroll' | 'benefits' | 'timeoff' | 'attendance' | 'timetracking' | 'performance' | 'policies' | 'orgchart';

interface ShiftEntry {
  id: string;
  clockIn: string;
  clockOut: string | null;
  duration: string;
}

export default function HRPage() {
  const { t, i18n } = useTranslation("admin");
  const dateLocale = i18n.language === "en" ? undefined : es;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [benefitPlans, setBenefitPlans] = useState<BenefitPlan[]>([]);
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>([]);
  const [companyPolicies, setCompanyPolicies] = useState<CompanyPolicy[]>([]);
  const [orgChart, setOrgChart] = useState<OrgNode[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<HRTab>('employees');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<CompanyPolicy | null>(null);
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const [deptFilter, setDeptFilter] = useState<Department | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [shiftLog, setShiftLog] = useState<ShiftEntry[]>([
    { id: "s1", clockIn: "2025-03-17T08:02:00", clockOut: "2025-03-17T12:15:00", duration: "4h 13m" },
    { id: "s2", clockIn: "2025-03-17T13:00:00", clockOut: "2025-03-17T17:30:00", duration: "4h 30m" },
    { id: "s3", clockIn: "2025-03-16T08:15:00", clockOut: "2025-03-16T16:45:00", duration: "8h 30m" },
  ]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [policyAcceptance, setPolicyAcceptance] = useState<Record<string, { accepted: boolean; timestamp: string | null }>>({});

  useEffect(() => {
    if (isClockedIn) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isClockedIn]);

  const handleClockIn = () => {
    setIsClockedIn(true);
    setClockInTime(new Date());
    setElapsedSeconds(0);
  };

  const handleClockOut = () => {
    if (!clockInTime) return;
    const now = new Date();
    const diffMs = now.getTime() - clockInTime.getTime();
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    const newEntry: ShiftEntry = {
      id: `s-${Date.now()}`,
      clockIn: clockInTime.toISOString(),
      clockOut: now.toISOString(),
      duration: `${hours}h ${minutes}m`,
    };
    setShiftLog(prev => [newEntry, ...prev]);
    setIsClockedIn(false);
    setClockInTime(null);
    setElapsedSeconds(0);
  };

  const formatElapsed = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handlePolicyAccept = (policyId: string) => {
    setPolicyAcceptance(prev => ({
      ...prev,
      [policyId]: prev[policyId]?.accepted
        ? { accepted: false, timestamp: null }
        : { accepted: true, timestamp: new Date().toISOString() },
    }));
  };

  useEffect(() => {
    Promise.all([
      hrService.getEmployees(),
      hrService.getCandidates(),
      hrService.getBenefitPlans(),
      hrService.getTimeOffRequests(),
      hrService.getPerformanceReviews(),
      hrService.getCompanyPolicies(),
      hrService.getOrgChart(),
      hrService.getAttendance(),
    ]).then(([emps, cands, bps, tos, revs, pols, org, att]) => {
      setEmployees(emps);
      setCandidates(cands);
      setBenefitPlans(bps);
      setTimeOffRequests(tos);
      setPerformanceReviews(revs);
      setCompanyPolicies(pols);
      setOrgChart(org);
      setAttendance(att);
      setLoading(false);
    });
  }, []);

  const filteredEmployees = employees
    .filter(e => deptFilter === 'all' || e.department === deptFilter)
    .filter(e => statusFilter === 'all' || e.status === statusFilter)
    .filter(e => !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase()));

  const departments = [...new Set(employees.map(e => e.department))];
  const totalPayroll = employees.filter(e => e.status !== 'terminated').reduce((s, e) => s + e.salary, 0);
  const activeEmployees = employees.filter(e => e.status === 'active').length;

  const handleMoveCandidate = async (candidateId: string, newStage: HiringStage) => {
    const updated = await hrService.updateCandidateStage(candidateId, newStage);
    if (updated) setCandidates(prev => prev.map(c => c.id === candidateId ? updated : c));
  };

  const handleTimeOffAction = async (id: string, status: 'approved' | 'denied') => {
    const updated = await hrService.updateTimeOffStatus(id, status);
    if (updated) setTimeOffRequests(prev => prev.map(r => r.id === id ? updated : r));
  };

  const TABS: { key: HRTab; labelKey: string; icon: any }[] = [
    { key: 'employees', labelKey: 'hr.tab.employees', icon: Users },
    { key: 'hiring', labelKey: 'hr.tab.hiring', icon: UserCheck },
    { key: 'payroll', labelKey: 'hr.tab.payroll', icon: DollarSign },
    { key: 'benefits', labelKey: 'hr.tab.benefits', icon: Heart },
    { key: 'timeoff', labelKey: 'hr.tab.timeoff', icon: CalendarOff },
    { key: 'attendance', labelKey: 'hr.tab.attendance', icon: ClipboardList },
    { key: 'timetracking', labelKey: 'hr.tab.timetracking', icon: Timer },
    { key: 'performance', labelKey: 'hr.tab.performance', icon: TrendingUp },
    { key: 'policies', labelKey: 'hr.tab.policies', icon: FileText },
    { key: 'orgchart', labelKey: 'hr.tab.orgchart', icon: Network },
  ];

  if (selectedPolicy) {
    return (
      <AdminLayout breadcrumbs={[{ label: t("titleHR"), href: "/admin/hr" }, { label: selectedPolicy.title }]}>
        <div className="p-4 md:p-6 lg:p-8 max-w-[900px] mx-auto space-y-6">
          <button onClick={() => setSelectedPolicy(null)} className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4" /> {t("hr.backToPolicies")}
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">{selectedPolicy.title}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
              <span>{t("hr.version")} {selectedPolicy.version}</span>
              <span>·</span>
              <span>{t("hr.updated")}: {format(new Date(selectedPolicy.lastUpdated), "d MMM yyyy", { locale: dateLocale })}</span>
              <span>·</span>
              <span>{selectedPolicy.acknowledgments}/{selectedPolicy.totalEmployees} {t("hr.acknowledgments")}</span>
            </div>
          </div>
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-4 md:p-6 lg:p-8">
              <div className="prose prose-slate max-w-none">
                {selectedPolicy.content.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-display font-bold text-slate-900 mt-6 mb-3">{line.replace('## ', '')}</h2>;
                  if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold text-slate-800 mt-5 mb-2">{line.replace('### ', '')}</h3>;
                  if (line.startsWith('- ')) return <div key={i} className="flex items-start gap-2 py-0.5 text-slate-600"><span className="text-primary mt-1.5 shrink-0">•</span><span>{line.replace('- ', '')}</span></div>;
                  if (line.match(/^\d+\.\s/)) return <div key={i} className="flex items-start gap-2 py-0.5 text-slate-600"><span className="font-medium text-primary shrink-0">{line.match(/^\d+/)![0]}.</span><span>{line.replace(/^\d+\.\s/, '')}</span></div>;
                  if (line.trim() === '') return <div key={i} className="h-2" />;
                  return <p key={i} className="text-slate-600 leading-relaxed my-1.5">{line}</p>;
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  if (selectedReview) {
    return (
      <AdminLayout breadcrumbs={[{ label: t("titleHR"), href: "/admin/hr" }, { label: `${t("hr.review")} - ${selectedReview.employeeName}` }]}>
        <div className="p-4 md:p-6 lg:p-8 max-w-[1100px] mx-auto space-y-6">
          <button onClick={() => setSelectedReview(null)} className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4" /> {t("hr.backToReviews")}
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
              {selectedReview.employeeAvatar}
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-slate-900">{selectedReview.employeeName}</h1>
              <p className="text-sm text-slate-500">{t("hr.review")} {selectedReview.cycle === 'annual' ? t("hr.cycle.annual") : selectedReview.cycle === 'semi-annual' ? t("hr.cycle.semiAnnual") : selectedReview.cycle === 'quarterly' ? t("hr.cycle.quarterly") : t("hr.cycle.probation")} — {selectedReview.period}</p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-3xl font-display font-bold text-primary">{selectedReview.overallRating.toFixed(1)}</div>
              <div className="flex gap-0.5 justify-end">
                {[1,2,3,4,5].map(s => <Star key={s} className={cn("h-4 w-4", s <= Math.round(selectedReview.overallRating) ? "text-amber-400 fill-amber-400" : "text-slate-200")} />)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4" /> {t("hr.reviewCategories")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {selectedReview.categories.map((cat, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{t("hr.weight")}: {cat.weight}%</span>
                        <span className="text-sm font-bold text-primary">{cat.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${(cat.rating / 5) * 100}%` }} />
                    </div>
                    {cat.comments && <p className="text-xs text-slate-500 mt-1">{cat.comments}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-base flex items-center gap-2"><Award className="h-4 w-4 text-emerald-500" /> {t("hr.strengths")}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {selectedReview.strengths.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" /> {s}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-amber-500" /> {t("hr.improvements")}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {selectedReview.improvements.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 text-sm text-slate-600">
                      <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" /> {s}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {selectedReview.goals.length > 0 && (
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2"><GraduationCap className="h-4 w-4" /> {t("hr.goalsAndObjectives")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {selectedReview.goals.map(goal => (
                  <div key={goal.id} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-900">{goal.title}</h4>
                      <Badge variant={goal.status === 'completed' ? 'success' : goal.status === 'in-progress' ? 'medium' : goal.status === 'overdue' ? 'destructive' : 'secondary'} className="text-[10px]">
                        {goal.status === 'completed' ? t("hr.goal.completed") : goal.status === 'in-progress' ? t("hr.goal.inProgress") : goal.status === 'overdue' ? t("hr.goal.overdue") : t("hr.goal.notStarted")}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{goal.description}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                        <div className={cn("rounded-full h-1.5 transition-all", goal.status === 'completed' ? 'bg-emerald-500' : goal.status === 'overdue' ? 'bg-red-500' : 'bg-primary')} style={{ width: `${goal.progress}%` }} />
                      </div>
                      <span className="text-xs font-medium text-slate-500">{goal.progress}%</span>
                      <span className="text-[10px] text-slate-400">{t("hr.goal.target")}: {format(new Date(goal.targetDate), "d MMM yyyy", { locale: dateLocale })}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {selectedReview.comments && (
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base">{t("hr.reviewerComments")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-slate-600 leading-relaxed">{selectedReview.comments}</p>
                <p className="text-xs text-slate-400 mt-3">— {selectedReview.reviewerName}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </AdminLayout>
    );
  }

  if (selectedEmployee) {
    const empBenefitDetails = selectedEmployee.benefits || [];
    const empPto = selectedEmployee.ptoBalance;
    return (
      <AdminLayout breadcrumbs={[{ label: t("titleHR"), href: "/admin/hr" }, { label: selectedEmployee.name }]}>
        <div className="p-4 md:p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
          <button onClick={() => setSelectedEmployee(null)} className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4" /> {t("hr.backToEmployees")}
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {selectedEmployee.avatar}
                </div>
                <h2 className="text-xl font-display font-bold text-slate-900">{selectedEmployee.name}</h2>
                <p className="text-sm text-slate-500 mt-1">{selectedEmployee.role}</p>
                <Badge variant={STATUS_VARIANTS[selectedEmployee.status]} className="mt-2">{t(STATUS_KEYS[selectedEmployee.status])}</Badge>

                {selectedEmployee.performanceRating && (
                  <div className="mt-3 flex items-center justify-center gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className={cn("h-4 w-4", s <= Math.round(selectedEmployee.performanceRating!) ? "text-amber-400 fill-amber-400" : "text-slate-200")} />)}
                    <span className="text-sm font-semibold text-slate-700 ml-1">{selectedEmployee.performanceRating.toFixed(1)}</span>
                  </div>
                )}

                <div className="mt-6 space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail className="h-4 w-4 text-slate-400" /> {selectedEmployee.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400" /> {selectedEmployee.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Building2 className="h-4 w-4 text-slate-400" /> {selectedEmployee.department}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-400" /> {t("hr.since")} {format(new Date(selectedEmployee.hireDate), "d MMM yyyy", { locale: dateLocale })}
                  </div>
                  {selectedEmployee.address && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 text-slate-400" /> {selectedEmployee.address}
                    </div>
                  )}
                  {selectedEmployee.emergencyContact && (
                    <div className="flex items-start gap-3 text-sm text-slate-600">
                      <AlertCircle className="h-4 w-4 text-slate-400 mt-0.5" />
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wide">{t("hr.emergencyContact")}</div>
                        {selectedEmployee.emergencyContact}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-2 space-y-6">
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-base flex items-center gap-2"><Briefcase className="h-4 w-4" /> {t("hr.workInfo")}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">{t("hr.department")}</div>
                      <div className="text-sm font-semibold text-slate-900">{selectedEmployee.department}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">{t("hr.role")}</div>
                      <div className="text-sm font-semibold text-slate-900">{selectedEmployee.role}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">{t("hr.startDate")}</div>
                      <div className="text-sm font-semibold text-slate-900">{format(new Date(selectedEmployee.hireDate), "d MMM yyyy", { locale: dateLocale })}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">{t("hr.annualSalary")}</div>
                      <div className="text-sm font-semibold text-emerald-700">{formatCurrency(selectedEmployee.salary)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {empPto && (
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-base flex items-center gap-2"><CalendarOff className="h-4 w-4" /> {t("hr.ptoBalance")}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(empPto).map(([type, bal]) => (
                        <div key={type} className="text-center p-3 bg-slate-50 rounded-lg">
                          <div className="text-xs text-slate-500 mb-1 capitalize">{t(TIMEOFF_TYPE_CONFIG[type]?.labelKey || `hr.timeoff.type.${type}`)}</div>
                          <div className="text-2xl font-bold text-primary">{bal.available}</div>
                          <div className="text-[10px] text-slate-400">{t("hr.of")} {bal.total} {t("hr.days")} ({bal.used} {t("hr.used")})</div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                            <div className="bg-primary rounded-full h-1.5" style={{ width: `${(bal.used / bal.total) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {empBenefitDetails.length > 0 && (
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-base flex items-center gap-2"><Heart className="h-4 w-4" /> {t("hr.enrolledBenefits")}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      {empBenefitDetails.map((b, i) => {
                        const meta = BENEFIT_ICONS[b.type];
                        return (
                          <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{meta?.icon || '📋'}</span>
                              <div>
                                <div className="text-sm font-semibold text-slate-900">{b.planName}</div>
                                <div className="text-[10px] text-slate-400 capitalize">{b.type}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-slate-900">{formatCurrency(b.employeeCost)}/{t("hr.month")}</div>
                              <Badge variant={b.status === 'active' ? 'success' : 'secondary'} className="text-[10px]">{b.status === 'active' ? t("hr.status.active") : b.status}</Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-base flex items-center gap-2"><DollarSign className="h-4 w-4" /> {t("hr.payrollHistory")}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {selectedEmployee.payrollHistory.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">{t("hr.noPayrollData")}</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm tablet-table-compact">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-2 text-slate-500 font-medium">{t("hr.period")}</th>
                            <th className="text-right py-2 text-slate-500 font-medium">{t("hr.grossPay")}</th>
                            <th className="text-right py-2 text-slate-500 font-medium">{t("hr.deductions")}</th>
                            <th className="text-right py-2 text-slate-500 font-medium">{t("hr.netPay")}</th>
                            <th className="text-right py-2 text-slate-500 font-medium">{t("hr.status.label")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedEmployee.payrollHistory.map(entry => (
                            <tr key={entry.id} className="border-b border-slate-50">
                              <td className="py-2.5 text-slate-700 font-medium">{entry.period}</td>
                              <td className="py-2.5 text-right text-slate-600">{formatCurrency(entry.grossPay)}</td>
                              <td className="py-2.5 text-right text-red-500">-{formatCurrency(entry.deductions)}</td>
                              <td className="py-2.5 text-right font-semibold text-slate-900">{formatCurrency(entry.netPay)}</td>
                              <td className="py-2.5 text-right"><Badge variant={PAYROLL_STATUS_VARIANTS[entry.status]} className="text-[10px]">{t(PAYROLL_STATUS_KEYS[entry.status])}</Badge></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout breadcrumbs={[{ label: t("titleDashboard"), href: "/admin/dashboard" }, { label: t("titleHR") }]}>
      <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">{t("titleHR")}</h1>
            <p className="text-sm text-slate-500 mt-1">{t("hr.subtitle")}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-sm border-slate-200"><CardContent className="p-4"><div className="text-2xl font-bold text-slate-900">{employees.length}</div><div className="text-xs text-slate-500">{t("hr.employees")}</div></CardContent></Card>
          <Card className="shadow-sm border-emerald-200 bg-emerald-50/50"><CardContent className="p-4"><div className="text-2xl font-bold text-emerald-700">{activeEmployees}</div><div className="text-xs text-emerald-600">{t("hr.active")}</div></CardContent></Card>
          <Card className="shadow-sm border-blue-200 bg-blue-50/50"><CardContent className="p-4"><div className="text-2xl font-bold text-blue-700">{candidates.length}</div><div className="text-xs text-blue-600">{t("hr.candidates")}</div></CardContent></Card>
          <Card className="shadow-sm border-amber-200 bg-amber-50/50"><CardContent className="p-4"><div className="text-2xl font-bold text-amber-700">{formatCurrency(totalPayroll)}</div><div className="text-xs text-amber-600">{t("hr.annualPayroll")}</div></CardContent></Card>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={cn("px-3 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap", activeTab === tab.key ? "bg-primary text-white" : "text-slate-500 hover:bg-slate-100")}>
                <Icon className="h-3.5 w-3.5" />
                {t(tab.labelKey)}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : activeTab === 'employees' ? (
          <>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative w-64">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input placeholder={t("hr.searchEmployee")} value={search} onChange={e => setSearch(e.target.value)} className="h-9 pl-9 text-sm" />
              </div>
              <select value={deptFilter} onChange={e => setDeptFilter(e.target.value as any)} className="h-9 px-3 text-sm border border-slate-200 rounded-lg bg-white">
                <option value="all">{t("hr.allDepts")}</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="h-9 px-3 text-sm border border-slate-200 rounded-lg bg-white">
                <option value="all">{t("hr.allStatuses")}</option>
                <option value="active">{t("hr.status.active")}</option>
                <option value="on-leave">{t("hr.status.onLeave")}</option>
                <option value="terminated">{t("hr.status.terminated")}</option>
              </select>
            </div>

            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {filteredEmployees.map(emp => (
                    <div key={emp.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedEmployee(emp)}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-xs shrink-0">{emp.avatar}</div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{emp.name}</div>
                          <div className="text-xs text-slate-500">{emp.role} · {emp.department}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {emp.performanceRating && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" /> {emp.performanceRating.toFixed(1)}
                          </div>
                        )}
                        <span className="text-xs text-slate-400 hidden sm:block">{formatDistanceToNow(new Date(emp.hireDate), { addSuffix: true, locale: dateLocale })}</span>
                        <Badge variant={STATUS_VARIANTS[emp.status]} className="text-[10px]">{t(STATUS_KEYS[emp.status])}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : activeTab === 'hiring' ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
            {HIRING_STAGES.map(stage => {
              const stageCandidates = candidates.filter(c => c.stage === stage.key);
              return (
                <div key={stage.key} className={cn("rounded-xl p-3 min-h-[300px]", stage.color)}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-700">{t(stage.labelKey)}</h3>
                    <Badge variant="secondary" className="text-[10px]">{stageCandidates.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {stageCandidates.map(cand => (
                      <Card key={cand.id} className="shadow-sm border-slate-200 cursor-move">
                        <CardContent className="p-3">
                          <div className="text-sm font-semibold text-slate-900">{cand.name}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{cand.position}</div>
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} className={cn("h-3 w-3", s <= cand.rating ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
                            ))}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">{formatDistanceToNow(new Date(cand.appliedDate), { addSuffix: true, locale: dateLocale })}</div>
                          {stage.key !== 'hired' && (
                            <div className="flex gap-1 mt-2">
                              {HIRING_STAGES.filter(s => HIRING_STAGES.indexOf(s) > HIRING_STAGES.findIndex(st => st.key === stage.key)).slice(0, 2).map(next => (
                                <Button key={next.key} size="sm" variant="ghost" className="h-6 text-[10px] px-2" onClick={() => handleMoveCandidate(cand.id, next.key)}>→ {t(next.labelKey)}</Button>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : activeTab === 'payroll' ? (
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base">{t("hr.payrollSummary")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm tablet-table-compact min-w-[640px]">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 text-slate-500 font-medium">{t("hr.employee")}</th>
                      <th className="text-left py-2 text-slate-500 font-medium">{t("hr.department")}</th>
                      <th className="text-right py-2 text-slate-500 font-medium">{t("hr.annualSalary")}</th>
                      <th className="text-right py-2 text-slate-500 font-medium">{t("hr.monthlyGross")}</th>
                      <th className="text-right py-2 text-slate-500 font-medium">{t("hr.lastPayment")}</th>
                      <th className="text-right py-2 text-slate-500 font-medium">{t("hr.status.label")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.filter(e => e.status === 'active' || e.status === 'on-leave').map(emp => {
                      const lastPayroll = emp.payrollHistory[0];
                      return (
                        <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedEmployee(emp)}>
                          <td className="py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-[10px]">{emp.avatar}</div>
                              <span className="font-medium text-slate-900">{emp.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 text-slate-600">{emp.department}</td>
                          <td className="py-2.5 text-right text-slate-900 font-medium">{formatCurrency(emp.salary)}</td>
                          <td className="py-2.5 text-right text-slate-600">{formatCurrency(emp.salary / 12)}</td>
                          <td className="py-2.5 text-right text-slate-500">{lastPayroll ? lastPayroll.period : '-'}</td>
                          <td className="py-2.5 text-right">
                            {lastPayroll ? <Badge variant={PAYROLL_STATUS_VARIANTS[lastPayroll.status]} className="text-[10px]">{t(PAYROLL_STATUS_KEYS[lastPayroll.status])}</Badge> : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-slate-300">
                      <td colSpan={2} className="py-2.5 font-bold text-slate-900">{t("common.total")}</td>
                      <td className="py-2.5 text-right font-bold text-slate-900">{formatCurrency(totalPayroll)}</td>
                      <td className="py-2.5 text-right font-bold text-slate-900">{formatCurrency(totalPayroll / 12)}</td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : activeTab === 'benefits' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="shadow-sm border-slate-200"><CardContent className="p-4"><div className="text-2xl font-bold text-slate-900">{benefitPlans.length}</div><div className="text-xs text-slate-500">{t("hr.availablePlans")}</div></CardContent></Card>
              <Card className="shadow-sm border-slate-200"><CardContent className="p-4"><div className="text-2xl font-bold text-emerald-700">{benefitPlans.reduce((s, p) => s + p.enrolledCount, 0)}</div><div className="text-xs text-slate-500">{t("hr.totalEnrollments")}</div></CardContent></Card>
              <Card className="shadow-sm border-slate-200"><CardContent className="p-4"><div className="text-2xl font-bold text-blue-700">{formatCurrency(benefitPlans.reduce((s, p) => s + p.employerContribution * p.enrolledCount, 0))}/{t("hr.month")}</div><div className="text-xs text-slate-500">{t("hr.employerContribution")}</div></CardContent></Card>
              <Card className="shadow-sm border-slate-200"><CardContent className="p-4"><div className="text-2xl font-bold text-purple-700">{formatCurrency(benefitPlans.reduce((s, p) => s + p.employeeContribution * p.enrolledCount, 0))}/{t("hr.month")}</div><div className="text-xs text-slate-500">{t("hr.employeeContribution")}</div></CardContent></Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefitPlans.map(plan => {
                const meta = BENEFIT_ICONS[plan.type];
                return (
                  <Card key={plan.id} className={cn("shadow-sm border", meta?.color || 'border-slate-200')}>
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <span className="text-2xl">{meta?.icon || '📋'}</span>
                        <div className="flex-1">
                          <h3 className="text-base font-display font-bold text-slate-900">{plan.name}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{plan.provider} · {plan.coverage}</p>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">{plan.enrolledCount} {t("hr.enrolled")}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">{plan.description}</p>

                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="p-2 bg-white/80 rounded-lg text-center min-w-0">
                          <div className="text-[10px] text-slate-500 mb-0.5">{t("hr.totalCost")}</div>
                          <div className="text-xs font-bold text-slate-900 break-words leading-tight">{formatCurrency(plan.monthlyCost)}<span className="font-normal text-slate-400">/{t("hr.month")}</span></div>
                        </div>
                        <div className="p-2 bg-white/80 rounded-lg text-center min-w-0">
                          <div className="text-[10px] text-slate-500 mb-0.5">{t("hr.employer")}</div>
                          <div className="text-xs font-bold text-emerald-700 break-words leading-tight">{formatCurrency(plan.employerContribution)}<span className="font-normal text-slate-400">/{t("hr.month")}</span></div>
                        </div>
                        <div className="p-2 bg-white/80 rounded-lg text-center min-w-0">
                          <div className="text-[10px] text-slate-500 mb-0.5">{t("hr.employeeShort")}</div>
                          <div className="text-xs font-bold text-blue-700 break-words leading-tight">{formatCurrency(plan.employeeContribution)}<span className="font-normal text-slate-400">/{t("hr.month")}</span></div>
                        </div>
                      </div>

                      {plan.deductible !== undefined && (
                        <div className="text-xs text-slate-500 mb-3">{t("hr.deductible")}: {formatCurrency(plan.deductible)}</div>
                      )}

                      <div className="space-y-1">
                        {plan.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                            <CheckCircle className="h-3 w-3 text-emerald-500 shrink-0" /> {f}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : activeTab === 'timeoff' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="shadow-sm border-slate-200"><CardContent className="p-4"><div className="text-2xl font-bold text-slate-900">{timeOffRequests.length}</div><div className="text-xs text-slate-500">{t("hr.totalRequests")}</div></CardContent></Card>
              <Card className="shadow-sm border-amber-200 bg-amber-50/50"><CardContent className="p-4"><div className="text-2xl font-bold text-amber-700">{timeOffRequests.filter(r => r.status === 'pending').length}</div><div className="text-xs text-amber-600">{t("hr.pendingApproval")}</div></CardContent></Card>
              <Card className="shadow-sm border-emerald-200 bg-emerald-50/50"><CardContent className="p-4"><div className="text-2xl font-bold text-emerald-700">{timeOffRequests.filter(r => r.status === 'approved').length}</div><div className="text-xs text-emerald-600">{t("hr.approved")}</div></CardContent></Card>
              <Card className="shadow-sm border-red-200 bg-red-50/50"><CardContent className="p-4"><div className="text-2xl font-bold text-red-700">{timeOffRequests.filter(r => r.status === 'denied').length}</div><div className="text-xs text-red-600">{t("hr.denied")}</div></CardContent></Card>
            </div>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base">{t("hr.timeOffRequests")}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {timeOffRequests.map(req => (
                    <div key={req.id} className="flex items-center justify-between p-4 hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-xs shrink-0">{req.employeeAvatar}</div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{req.employeeName}</div>
                          <div className="text-xs text-slate-500">{req.department} · {req.reason}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", TIMEOFF_TYPE_CONFIG[req.type]?.color || 'bg-slate-100')}>{t(TIMEOFF_TYPE_CONFIG[req.type]?.labelKey || req.type)}</span>
                        <div className="text-right">
                          <div className="text-xs font-medium text-slate-700">{format(new Date(req.startDate), "d MMM", { locale: dateLocale })} - {format(new Date(req.endDate), "d MMM", { locale: dateLocale })}</div>
                          <div className="text-[10px] text-slate-400">{req.totalDays} {t("hr.days", { count: req.totalDays })}</div>
                        </div>
                        <Badge variant={TIMEOFF_STATUS_VARIANTS[req.status]} className="text-[10px]">{t(TIMEOFF_STATUS_KEYS[req.status])}</Badge>
                        {req.status === 'pending' && (
                          <div className="flex gap-1 ml-2">
                            <Button size="sm" variant="outline" className="h-7 text-[10px] px-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => handleTimeOffAction(req.id, 'approved')}>
                              <CheckCircle className="h-3 w-3 mr-1" /> {t("hr.approve")}
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-[10px] px-2 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleTimeOffAction(req.id, 'denied')}>
                              <XCircle className="h-3 w-3 mr-1" /> {t("hr.deny")}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : activeTab === 'attendance' ? (
          <div className="space-y-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="shadow-sm border-slate-200"><CardContent className="p-4"><div className="text-2xl font-bold text-slate-900">{attendance.filter(a => a.date === attendance[0]?.date).length}</div><div className="text-xs text-slate-500">{t("hr.todayRecords")}</div></CardContent></Card>
              <Card className="shadow-sm border-emerald-200 bg-emerald-50/50"><CardContent className="p-4"><div className="text-2xl font-bold text-emerald-700">{attendance.filter(a => a.status === 'present').length}</div><div className="text-xs text-emerald-600">{t("hr.present")}</div></CardContent></Card>
              <Card className="shadow-sm border-purple-200 bg-purple-50/50"><CardContent className="p-4"><div className="text-2xl font-bold text-purple-700">{attendance.filter(a => a.status === 'remote').length}</div><div className="text-xs text-purple-600">{t("hr.remote")}</div></CardContent></Card>
              <Card className="shadow-sm border-red-200 bg-red-50/50"><CardContent className="p-4"><div className="text-2xl font-bold text-red-700">{attendance.filter(a => a.status === 'absent' || a.status === 'late').length}</div><div className="text-xs text-red-600">{t("hr.absentLate")}</div></CardContent></Card>
            </div>
            </div>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2"><ClipboardList className="h-4 w-4" /> {t("hr.attendanceRecord")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm tablet-table-compact">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 text-slate-500 font-medium">{t("hr.employee")}</th>
                        <th className="text-left py-2 text-slate-500 font-medium">{t("hr.date")}</th>
                        <th className="text-left py-2 text-slate-500 font-medium">{t("hr.checkIn")}</th>
                        <th className="text-left py-2 text-slate-500 font-medium">{t("hr.checkOut")}</th>
                        <th className="text-right py-2 text-slate-500 font-medium">{t("hr.hours")}</th>
                        <th className="text-right py-2 pr-3 text-slate-500 font-medium">{t("hr.status.label")}</th>
                        <th className="text-left py-2 pl-3 text-slate-500 font-medium">{t("hr.notes")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map(rec => (
                        <tr key={rec.id} className="border-b border-slate-50 hover:bg-slate-50">
                          <td className="py-2.5 font-medium text-slate-900">{rec.employeeName}</td>
                          <td className="py-2.5 text-slate-600">{format(new Date(rec.date), "d MMM yyyy", { locale: dateLocale })}</td>
                          <td className="py-2.5 text-slate-600">{rec.clockIn || '—'}</td>
                          <td className="py-2.5 text-slate-600">{rec.clockOut || '—'}</td>
                          <td className="py-2.5 text-right text-slate-700 font-medium">{rec.hoursWorked > 0 ? rec.hoursWorked.toFixed(1) : '—'}</td>
                          <td className="py-2.5 text-right">
                            <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", ATTENDANCE_STATUS_CONFIG[rec.status]?.color || 'bg-slate-100')}>{t(ATTENDANCE_STATUS_CONFIG[rec.status]?.labelKey || rec.status)}</span>
                          </td>
                          <td className="py-2.5 text-xs text-slate-400">{rec.notes || ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : activeTab === 'timetracking' ? (
          <div className="space-y-6">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2"><Timer className="h-4 w-4" /> {t("hr.clockInOut")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className={cn("text-6xl font-mono font-bold mb-6", isClockedIn ? "text-primary" : "text-slate-300")}>
                    {formatElapsed(elapsedSeconds)}
                  </div>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    {!isClockedIn ? (
                      <Button onClick={handleClockIn} className="px-8 py-3 text-lg bg-emerald-600 hover:bg-emerald-700">
                        <PlayCircle className="h-5 w-5 mr-2" /> {t("hr.clockIn")}
                      </Button>
                    ) : (
                      <Button onClick={handleClockOut} className="px-8 py-3 text-lg bg-red-600 hover:bg-red-700">
                        <StopCircle className="h-5 w-5 mr-2" /> {t("hr.clockOut")}
                      </Button>
                    )}
                  </div>
                  {isClockedIn && clockInTime && (
                    <div className="text-sm text-slate-500">
                      {t("hr.checkIn")}: {clockInTime.toLocaleTimeString("es-PR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  )}
                  <Badge variant={isClockedIn ? "success" : "secondary"} className="mt-2">
                    {isClockedIn ? t("hr.onShift") : t("hr.offShift")}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base flex items-center gap-2"><ClipboardList className="h-4 w-4" /> {t("hr.shiftLog")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm tablet-table-compact">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 text-slate-500 font-medium">{t("hr.checkIn")}</th>
                        <th className="text-left py-2 text-slate-500 font-medium">{t("hr.checkOut")}</th>
                        <th className="text-right py-2 text-slate-500 font-medium">{t("hr.duration")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shiftLog.map(entry => (
                        <tr key={entry.id} className="border-b border-slate-50">
                          <td className="py-2.5 text-slate-700">{new Date(entry.clockIn).toLocaleString("es-PR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                          <td className="py-2.5 text-slate-700">{entry.clockOut ? new Date(entry.clockOut).toLocaleString("es-PR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                          <td className="py-2.5 text-right font-semibold text-primary">{entry.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {shiftLog.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-sm">{t("hr.noShiftRecords")}</div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : activeTab === 'performance' ? (
          <div className="space-y-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="shadow-sm border-slate-200"><CardContent className="p-4"><div className="text-2xl font-bold text-slate-900">{performanceReviews.length}</div><div className="text-xs text-slate-500">{t("hr.totalReviews")}</div></CardContent></Card>
              <Card className="shadow-sm border-emerald-200 bg-emerald-50/50"><CardContent className="p-4"><div className="text-2xl font-bold text-emerald-700">{performanceReviews.filter(r => r.status === 'completed').length}</div><div className="text-xs text-emerald-600">{t("hr.completed")}</div></CardContent></Card>
              <Card className="shadow-sm border-blue-200 bg-blue-50/50"><CardContent className="p-4"><div className="text-2xl font-bold text-blue-700">{performanceReviews.filter(r => r.status === 'in-progress').length}</div><div className="text-xs text-blue-600">{t("hr.inProgress")}</div></CardContent></Card>
              <Card className="shadow-sm border-amber-200 bg-amber-50/50"><CardContent className="p-4"><div className="text-2xl font-bold text-amber-700">{(performanceReviews.reduce((s, r) => s + r.overallRating, 0) / (performanceReviews.length || 1)).toFixed(1)}</div><div className="text-xs text-amber-600">{t("hr.avgRating")}</div></CardContent></Card>
            </div>
            </div>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-base">{t("hr.performanceReviews")}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {performanceReviews.map(rev => (
                    <div key={rev.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedReview(rev)}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-xs shrink-0">{rev.employeeAvatar}</div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{rev.employeeName}</div>
                          <div className="text-xs text-slate-500">{t(`hr.cycle.${rev.cycle}`)} — {rev.period}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(s => <Star key={s} className={cn("h-3.5 w-3.5", s <= Math.round(rev.overallRating) ? "text-amber-400 fill-amber-400" : "text-slate-200")} />)}
                          <span className="text-sm font-bold text-slate-700 ml-1">{rev.overallRating.toFixed(1)}</span>
                        </div>
                        <Badge variant={rev.status === 'completed' ? 'success' : rev.status === 'in-progress' ? 'medium' : 'secondary'} className="text-[10px]">
                          {rev.status === 'completed' ? t("hr.completed") : rev.status === 'in-progress' ? t("hr.inProgress") : rev.status === 'acknowledged' ? t("hr.acknowledged") : t("hr.draft")}
                        </Badge>
                        <span className="text-xs text-slate-400">{formatDistanceToNow(new Date(rev.createdAt), { addSuffix: true, locale: dateLocale })}</span>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : activeTab === 'policies' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companyPolicies.map(policy => {
                const cat = POLICY_CATEGORIES[policy.category];
                const CatIcon = cat?.icon || FileText;
                const ackPct = policy.totalEmployees > 0 ? Math.round((policy.acknowledgments / policy.totalEmployees) * 100) : 0;
                const acceptance = policyAcceptance[policy.id];
                return (
                  <Card key={policy.id} className="shadow-sm border-slate-200 hover:shadow-lg transition-all group">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 mb-3 cursor-pointer" onClick={() => setSelectedPolicy(policy)}>
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                          <CatIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-display font-bold text-slate-900 group-hover:text-primary transition-colors">{policy.title}</h3>
                          <span className="text-[10px] text-slate-400">{t(cat?.labelKey || policy.category)} · v{policy.version}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2">{policy.description}</p>

                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-400">{t("hr.acknowledgments")}</span>
                        <span className="text-[10px] font-medium text-slate-600">{policy.acknowledgments}/{policy.totalEmployees}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3">
                        <div className={cn("rounded-full h-1.5 transition-all", ackPct === 100 ? 'bg-emerald-500' : 'bg-primary')} style={{ width: `${ackPct}%` }} />
                      </div>

                      <div className={cn("p-3 rounded-lg border-2 transition-all", acceptance?.accepted ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50")}>
                        <label className="flex items-start gap-2 cursor-pointer" onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={!!acceptance?.accepted}
                            onChange={() => handlePolicyAccept(policy.id)}
                            className="accent-emerald-600 w-4 h-4 mt-0.5"
                          />
                          <div>
                            <span className="text-xs font-medium text-slate-700">
                              {acceptance?.accepted ? t("hr.policyAccepted") : t("hr.acceptPolicy")}
                            </span>
                            {acceptance?.timestamp && (
                              <div className="text-[10px] text-emerald-600 mt-0.5">
                                {t("hr.acceptedOn")}: {format(new Date(acceptance.timestamp), "d MMM yyyy HH:mm", { locale: dateLocale })}
                              </div>
                            )}
                          </div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400">
                        <span>{t("hr.updated")}: {format(new Date(policy.lastUpdated), "d MMM yyyy", { locale: dateLocale })}</span>
                        <button onClick={() => setSelectedPolicy(policy)} className="hover:text-primary transition-colors">
                          <Eye className="h-3 w-3" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : activeTab === 'orgchart' ? (
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base flex items-center gap-2"><Network className="h-4 w-4" /> {t("hr.orgChart")}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {(() => {
                const ceo = orgChart.find(n => !n.managerId);
                if (!ceo) return null;
                const directReports = orgChart.filter(n => n.managerId === ceo.id);

                return (
                  <div className="flex flex-col items-center">
                    <div className="p-4 bg-gradient-to-tr from-primary to-accent rounded-xl text-white text-center shadow-lg mb-2 min-w-[200px]">
                      <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">{ceo.avatar}</div>
                      <div className="font-display font-bold">{ceo.name}</div>
                      <div className="text-xs text-white/80">{ceo.role}</div>
                      <div className="text-[10px] text-white/60 mt-1">{ceo.department}</div>
                    </div>

                    <div className="w-px h-8 bg-slate-300"></div>
                    <div className="w-full max-w-5xl border-t-2 border-slate-300"></div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-0 w-full max-w-5xl">
                      {directReports.map(report => {
                        const subReports = orgChart.filter(n => n.managerId === report.id);
                        return (
                          <div key={report.id} className="flex flex-col items-center">
                            <div className="w-px h-8 bg-slate-300"></div>
                            <div className="p-3 bg-white border-2 border-slate-200 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow min-w-[160px] cursor-pointer" onClick={() => {
                              const emp = employees.find(e => e.id === report.id);
                              if (emp) setSelectedEmployee(emp);
                            }}>
                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/80 to-accent/80 flex items-center justify-center text-white font-bold text-xs mx-auto mb-2">{report.avatar}</div>
                              <div className="text-sm font-semibold text-slate-900">{report.name}</div>
                              <div className="text-[10px] text-slate-500">{report.role}</div>
                              <Badge variant="secondary" className="text-[9px] mt-1">{report.department}</Badge>
                            </div>

                            {subReports.length > 0 && (
                              <>
                                <div className="w-px h-4 bg-slate-200"></div>
                                <div className="space-y-2 w-full">
                                  {subReports.map(sub => (
                                    <div key={sub.id} className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => {
                                      const emp = employees.find(e => e.id === sub.id);
                                      if (emp) setSelectedEmployee(emp);
                                    }}>
                                      <div className="flex items-center gap-2 justify-center">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary/60 to-accent/60 flex items-center justify-center text-white font-bold text-[8px]">{sub.avatar}</div>
                                        <div className="text-left">
                                          <div className="text-[11px] font-medium text-slate-700">{sub.name}</div>
                                          <div className="text-[9px] text-slate-400">{sub.role}</div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </AdminLayout>
  );
}
