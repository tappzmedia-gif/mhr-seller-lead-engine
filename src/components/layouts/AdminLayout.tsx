import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, Users, SquareKanban, BarChart3, 
  CheckSquare, Settings, Bell, Search, LogOut, Menu, X, Building2,
  FileCheck, DollarSign, MessageSquare, UserCog, Megaphone,
  Zap, Activity, Command, Calendar, CalendarCheck, Video, 
  UserCircle, FolderOpen, FileText, Receipt, Plug, LayoutTemplate, Home,
  Shield, ChevronDown, Bot, MessagesSquare, Clock,
  ClipboardList, BookOpen, Briefcase
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { DemoMode } from "@/components/DemoMode";
import { cn } from "@/lib/utils";
import { notifications as notifData, evaluations, offers } from "@/store";
import { getBranding } from "@/store/branding-store";
import { getActiveRole, getRoles, setActiveRole, getVisibleModules } from "@/store/roles-store";
import { getLeadsStore } from "@/hooks/use-leads";
import { isBefore, isToday } from "date-fns";

const NAVIGATION_GROUPS = [
  {
    label: null,
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Lead Center", href: "/admin/leads", icon: Users },
      { name: "Pipeline", href: "/admin/pipeline", icon: SquareKanban },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { name: "Follow-ups", href: "/admin/follow-ups", icon: CheckSquare },
    ],
  },
  {
    label: "Gestión",
    items: [
      { name: "Listings", href: "/admin/listings", icon: Home },
      { name: "Evaluations", href: "/admin/evaluations", icon: FileCheck },
      { name: "Offers", href: "/admin/offers", icon: DollarSign },
      { name: "Communications", href: "/admin/communications", icon: MessageSquare },
      { name: "Messaging", href: "/admin/messaging", icon: MessagesSquare },
      { name: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
    ],
  },
  {
    label: "Operations",
    items: [
      { name: "Calendar", href: "/admin/calendar", icon: Calendar },
      { name: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
      { name: "Scheduling", href: "/admin/scheduling", icon: Clock },
      { name: "Meetings", href: "/admin/meetings", icon: Video },
      { name: "Clients", href: "/admin/clients", icon: UserCircle },
      { name: "Documents", href: "/admin/documents", icon: FolderOpen },
      { name: "Forms", href: "/admin/forms", icon: ClipboardList },
    ],
  },
  {
    label: "Finance",
    items: [
      { name: "Billing", href: "/admin/billing", icon: DollarSign },
      { name: "Proposals", href: "/admin/proposals", icon: FileText },
      { name: "Invoices", href: "/admin/invoices", icon: Receipt },
    ],
  },
  {
    label: "Sistema",
    items: [
      { name: "Team", href: "/admin/team", icon: UserCog },
      { name: "User Roles", href: "/admin/user-roles", icon: Shield },
      { name: "AI Assistant", href: "/admin/ai-assistant", icon: Bot },
      { name: "Automations", href: "/admin/automations", icon: Zap },
      { name: "Activity Log", href: "/admin/activity-log", icon: Activity },
      { name: "Notifications", href: "/admin/notifications", icon: Bell },
      { name: "Integrations", href: "/admin/integrations", icon: Plug },
      { name: "Templates", href: "/admin/templates", icon: LayoutTemplate },
      { name: "Learning", href: "/admin/learning", icon: BookOpen },
      { name: "HR", href: "/admin/hr", icon: Briefcase },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

function useBadgeCounts() {
  const [counts, setCounts] = useState({ urgent: 0, overdue: 0, pendingEvals: 0, openOffers: 0 });

  useEffect(() => {
    const compute = () => {
      const leads = getLeadsStore();
      const now = new Date();
      const urgent = leads.filter(l => l.priority === "Urgent" && !["Won", "Lost", "Not Qualified"].includes(l.status)).length;
      const overdue = leads.filter(l =>
        l.nextFollowUp && isBefore(new Date(l.nextFollowUp), now) && !isToday(new Date(l.nextFollowUp)) && !["Won", "Lost", "Not Qualified"].includes(l.status)
      ).length;
      const pendingEvals = evaluations.filter(e => e.status === "Pending" || e.status === "Scheduled").length;
      const openOffers = offers.filter(o => ["Sent", "Under Review", "Countered"].includes(o.status)).length;
      setCounts({ urgent, overdue, pendingEvals, openOffers });
    };
    compute();
    const interval = setInterval(compute, 5000);
    return () => clearInterval(interval);
  }, []);

  return counts;
}

export function AdminLayout({ children, breadcrumbs }: { children: React.ReactNode; breadcrumbs?: { label: string; href?: string }[] }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(() => notifData.filter(n => !n.read).length);
  const [branding, setBranding] = useState(getBranding);
  const [activeRole, setActiveRoleState] = useState(getActiveRole);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const roles = getRoles();
  const badgeCounts = useBadgeCounts();

  const visibleModules = useMemo(() => getVisibleModules(), [activeRole]);

  useEffect(() => {
    const handleNotifUpdate = () => setUnreadCount(notifData.filter(n => !n.read).length);
    const handleBrandingUpdate = () => setBranding(getBranding());
    const handleRoleUpdate = () => setActiveRoleState(getActiveRole());
    window.addEventListener("notifications-updated", handleNotifUpdate);
    window.addEventListener("branding-updated", handleBrandingUpdate);
    window.addEventListener("role-updated", handleRoleUpdate);
    return () => {
      window.removeEventListener("notifications-updated", handleNotifUpdate);
      window.removeEventListener("branding-updated", handleBrandingUpdate);
      window.removeEventListener("role-updated", handleRoleUpdate);
    };
  }, []);

  const filteredGroups = NAVIGATION_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item => visibleModules.includes(item.name)),
  })).filter(group => group.items.length > 0);

  const getBadgeCount = (itemName: string) => {
    if (itemName === "Lead Center") return badgeCounts.urgent > 0 ? badgeCounts.urgent : 0;
    if (itemName === "Follow-ups") return badgeCounts.overdue > 0 ? badgeCounts.overdue : 0;
    if (itemName === "Evaluations") return badgeCounts.pendingEvals > 0 ? badgeCounts.pendingEvals : 0;
    if (itemName === "Offers") return badgeCounts.openOffers > 0 ? badgeCounts.openOffers : 0;
    if (itemName === "Notifications") return unreadCount > 0 ? unreadCount : 0;
    return 0;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside data-tour="sidebar" className={cn(
        "fixed inset-y-0 left-0 z-50 bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 lg:translate-x-0 border-r border-sidebar-border shadow-2xl lg:shadow-none",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        collapsed ? "w-16" : "w-60"
      )}>
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border/50">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-white overflow-hidden">
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt="Logo" className="h-8 w-8 rounded-lg object-contain shrink-0" />
            ) : (
              <Building2 className="h-6 w-6 text-primary shrink-0" />
            )}
            {!collapsed && <span className="font-display font-bold text-lg leading-tight tracking-tight whitespace-nowrap">{branding.tagline.replace("™", "")}<span className="text-primary text-sm relative -top-2">™</span></span>}
          </Link>
          <button className="ml-auto lg:hidden text-slate-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
          {filteredGroups.map((group, gi) => (
            <div key={gi}>
              {!collapsed && group.label && (
                <div className="px-2 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {group.label}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location === item.href || location.startsWith(`${item.href}/`);
                  const badge = getBadgeCount(item.name);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                        isActive
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "text-slate-300 hover:bg-white/10 hover:text-white",
                        collapsed && "justify-center px-0"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className={cn("h-4.5 w-4.5 shrink-0", collapsed ? "h-5 w-5" : "transition-transform group-hover:scale-110")} />
                      {!collapsed && <span className="truncate">{item.name}</span>}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                          {item.name}
                        </div>
                      )}
                      {badge > 0 && (
                        <span className={cn(
                          "text-[10px] font-bold rounded-full flex items-center justify-center",
                          collapsed ? "absolute -top-1 -right-1 w-4 h-4" : "ml-auto w-5 h-5",
                          item.name === "Follow-ups" ? "bg-red-500 text-white" :
                          item.name === "Lead Center" ? "bg-orange-500 text-white" :
                          "bg-red-500 text-white"
                        )}>{badge}</span>
                      )}
                      {item.name === "Messaging" && (
                        <span className={cn("bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center", collapsed ? "absolute -top-1 -right-1 w-4 h-4" : "ml-auto w-5 h-5")}>12</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border/50">
          {!collapsed && (
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0">
                MS
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">María Santos</span>
                <span className="text-[11px] text-slate-400">{activeRole.name}</span>
              </div>
            </div>
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex flex-1 items-center justify-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {collapsed ? <Menu className="h-4 w-4" /> : <><X className="h-3 w-3" /> Collapse</>}
            </button>
            {!collapsed && (
              <Link href="/" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                <LogOut className="h-3 w-3" />
                Exit
              </Link>
            )}
          </div>
        </div>
      </aside>

      <div className={cn("flex-1 flex flex-col min-w-0 transition-all duration-300", collapsed ? "lg:pl-16" : "lg:pl-60")}>
        <header className="h-14 bg-white border-b border-border/40 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-sm shadow-black/5">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-slate-500 hover:text-slate-900" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>

            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="hidden sm:flex items-center gap-1.5 text-sm">
                {breadcrumbs.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-slate-300">/</span>}
                    {crumb.href ? (
                      <Link href={crumb.href} className="text-slate-500 hover:text-primary transition-colors">{crumb.label}</Link>
                    ) : (
                      <span className="text-slate-700 font-medium">{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}

            <button
              data-tour="search"
              onClick={() => window.dispatchEvent(new CustomEvent("toggle-command-palette"))}
              className="hidden md:flex items-center gap-2 h-8 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/50 rounded-lg pl-3 pr-2 text-sm text-slate-400 transition-colors ml-2"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="text-xs">Buscar...</span>
              <kbd className="hidden lg:inline-flex h-5 items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 text-[10px] font-medium text-slate-400">
                <Command className="h-2.5 w-2.5" />K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative" data-tour="role-switcher">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center gap-1.5 h-8 px-3 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/50 rounded-lg text-xs font-medium text-slate-600 transition-colors"
              >
                <Shield className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{activeRole.name}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {showRoleSwitcher && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowRoleSwitcher(false)} />
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 max-h-72 overflow-y-auto">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Demo Role Switcher</div>
                    {roles.map(role => (
                      <button
                        key={role.id}
                        onClick={() => { setActiveRole(role.id); setShowRoleSwitcher(false); }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors",
                          role.id === activeRole.id && "bg-primary/5 text-primary font-medium"
                        )}
                      >
                        <div className="font-medium">{role.name}</div>
                        <div className="text-[11px] text-slate-400">{role.description}</div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Link href="/admin/notifications" data-tour="notifications">
              <button className="relative p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-100">
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive border-2 border-white"></span>}
              </button>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      <DemoMode />
    </div>
  );
}
