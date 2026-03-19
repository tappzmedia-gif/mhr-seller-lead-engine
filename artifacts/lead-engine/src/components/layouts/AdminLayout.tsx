import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, Users, SquareKanban, BarChart3, 
  CheckSquare, Settings, Bell, Search, LogOut, Menu, X, Building2,
  FileCheck, DollarSign, MessageSquare, UserCog, Megaphone,
  Zap, Activity, Command, Calendar, CalendarCheck, Video, 
  UserCircle, FolderOpen, FileText, Receipt, Plug, LayoutTemplate, Home,
  Shield, ChevronDown, Bot, MessagesSquare, Clock,
  ClipboardList, BookOpen, Briefcase, ChevronLeft, ChevronRight
} from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { DemoMode } from "@/components/DemoMode";
import { cn } from "@/lib/utils";
import { notifications as notifData, evaluations, offers } from "@/store";
import { getBranding } from "@/store/branding-store";
import { getActiveRole, getRoles, setActiveRole, getVisibleModules } from "@/store/roles-store";
import { getLeadsStore } from "@/hooks/use-leads";
import { AGENTS } from "@/lib/constants";
import { isBefore, isToday } from "date-fns";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslation } from "react-i18next";
import { useIsTablet } from "@/hooks/use-mobile";

const SIDEBAR_TOGGLED_KEY = "admin_sidebar_toggled";
const SIDEBAR_SCROLL_KEY = "admin_sidebar_scroll";

const NAV_ITEM_KEYS: Record<string, string> = {
  "Dashboard": "nav_dashboard",
  "Lead Center": "nav_leadCenter",
  "Pipeline": "nav_pipeline",
  "Analytics": "nav_analytics",
  "Follow-ups": "nav_followUps",
  "Listings": "nav_listings",
  "Evaluations": "nav_evaluations",
  "Offers": "nav_offers",
  "Communications": "nav_communications",
  "Messaging": "nav_messaging",
  "Campaigns": "nav_campaigns",
  "Calendar": "nav_calendar",
  "Bookings": "nav_bookings",
  "Scheduling": "nav_scheduling",
  "Meetings": "nav_meetings",
  "Clients": "nav_clients",
  "Documents": "nav_documents",
  "Forms": "nav_forms",
  "Billing": "nav_billing",
  "Proposals": "nav_proposals",
  "Invoices": "nav_invoices",
  "Team": "nav_team",
  "User Roles": "nav_userRoles",
  "AI Assistant": "nav_aiAssistant",
  "Automations": "nav_automations",
  "Activity Log": "nav_activityLog",
  "Notifications": "nav_notifications",
  "Integrations": "nav_integrations",
  "Templates": "nav_templates",
  "Learning": "nav_learning",
  "HR": "nav_hr",
  "Settings": "nav_settings",
};

const GROUP_KEYS: Record<string, string> = {
  "Gestión": "group_management",
  "Operations": "group_operations",
  "Finance": "group_finance",
  "Sistema": "group_system",
};

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
  const { t } = useTranslation("admin");
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarToggled, setSidebarToggledState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_TOGGLED_KEY);
      return stored === "true";
    } catch {
      return false;
    }
  });
  const [unreadCount, setUnreadCount] = useState(() => notifData.filter(n => !n.read).length);
  const [branding, setBranding] = useState(getBranding);
  const [activeRole, setActiveRoleState] = useState(getActiveRole);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const roles = getRoles();
  const badgeCounts = useBadgeCounts();
  const isTablet = useIsTablet();
  const navRef = useRef<HTMLElement>(null);

  const setSidebarToggled = (val: boolean) => {
    setSidebarToggledState(val);
    try {
      localStorage.setItem(SIDEBAR_TOGGLED_KEY, String(val));
    } catch {}
  };

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

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    try {
      const saved = localStorage.getItem(SIDEBAR_SCROLL_KEY);
      if (saved !== null) nav.scrollTop = parseInt(saved, 10);
    } catch {}
    const onScroll = () => {
      try {
        localStorage.setItem(SIDEBAR_SCROLL_KEY, String(nav.scrollTop));
      } catch {}
    };
    nav.addEventListener("scroll", onScroll, { passive: true });
    return () => nav.removeEventListener("scroll", onScroll);
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

  const isRailMode = isTablet !== sidebarToggled;

  return (
    <div className="min-h-screen bg-slate-50/50 flex overflow-x-hidden">
      {/* Mobile overlay backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside data-tour="sidebar" className={cn(
        "fixed inset-y-0 left-0 z-50 bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300 border-r border-sidebar-border shadow-2xl overflow-hidden max-w-full",
        "max-md:-translate-x-full max-md:w-60",
        mobileMenuOpen && "max-md:translate-x-0",
        "md:translate-x-0 lg:shadow-none",
        isTablet
          ? (sidebarToggled ? "md:w-60" : "md:w-14")
          : (sidebarToggled ? "lg:w-14 md:w-14" : "lg:w-60 md:w-14"),
      )}>
        {/* Sidebar header */}
        <div className={cn(
          "h-14 flex items-center border-b border-sidebar-border/50 shrink-0",
          isRailMode ? "px-0 justify-center" : "px-4"
        )}>
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-white overflow-hidden w-full">
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt="Logo" className="h-8 w-8 rounded-lg object-contain shrink-0" />
            ) : (
              <Building2 className="h-6 w-6 text-primary shrink-0" />
            )}
            {!isRailMode && (
              <span className="font-display font-bold text-lg leading-tight tracking-tight whitespace-nowrap min-w-0 truncate">
                {branding.tagline.replace("™", "")}
                <span className="text-primary text-sm relative -top-2">™</span>
              </span>
            )}
          </Link>
          {/* Mobile close button */}
          <button
            className="ml-auto md:hidden text-slate-400 hover:text-white p-1 shrink-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav ref={navRef} className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-1.5 space-y-3">
          {filteredGroups.map((group, gi) => (
            <div key={gi}>
              {!isRailMode && group.label && (
                <div className="px-2 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {t(GROUP_KEYS[group.label] || group.label, group.label)}
                </div>
              )}
              {isRailMode && group.label && gi > 0 && (
                <div className="border-t border-sidebar-border/30 my-1" />
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location === item.href || location.startsWith(`${item.href}/`);
                  const badge = getBadgeCount(item.name);
                  const itemLabel = t(NAV_ITEM_KEYS[item.name] || item.name, item.name);
                  const showIconOnly = isRailMode;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      aria-label={showIconOnly ? item.name : undefined}
                      title={showIconOnly ? item.name : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative w-full",
                        "min-h-[44px]",
                        showIconOnly ? "px-0 justify-center py-2" : "px-2.5 py-2",
                        isActive
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "text-slate-300 hover:bg-white/10 hover:text-white"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className={cn("h-5 w-5 shrink-0", !showIconOnly && "transition-transform group-hover:scale-110")} />
                      {!showIconOnly && <span className="truncate min-w-0">{itemLabel}</span>}
                      {/* Badge */}
                      {badge > 0 && (
                        <span className={cn(
                          "text-[10px] font-bold rounded-full flex items-center justify-center shrink-0",
                          showIconOnly ? "absolute -top-1 -right-1 w-4 h-4" : "ml-auto w-5 h-5",
                          item.name === "Follow-ups" ? "bg-red-500 text-white" :
                          item.name === "Lead Center" ? "bg-orange-500 text-white" :
                          "bg-red-500 text-white"
                        )}>{badge}</span>
                      )}
                      {item.name === "Messaging" && (
                        <span className={cn(
                          "bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0",
                          showIconOnly ? "absolute -top-1 -right-1 w-4 h-4" : "ml-auto w-5 h-5"
                        )}>12</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-2 border-t border-sidebar-border/50 shrink-0">
          {!isRailMode && (
            <div className="flex items-center gap-3 px-2 py-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0">
                {AGENTS[0].avatar}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">{AGENTS[0].name}</span>
                <span className="text-[11px] text-slate-400">{activeRole.name}</span>
              </div>
            </div>
          )}
          <div className="flex items-center gap-1 justify-center">
            {isTablet && (
              <button
                onClick={() => setSidebarToggled(!sidebarToggled)}
                className="flex flex-1 items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors min-h-[44px]"
                aria-label={sidebarToggled ? t("collapse", "Colapsar") : t("expand", "Expandir")}
              >
                {sidebarToggled ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            )}
            {!isRailMode && (
              <Link href="/" className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors min-h-[44px]">
                <LogOut className="h-3 w-3" />
                {t("exit", "Salir")}
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300 pl-0 admin-main-content",
        isTablet
          ? (sidebarToggled ? "md:pl-60" : "md:pl-14")
          : (sidebarToggled ? "lg:pl-14 md:pl-14" : "lg:pl-60 md:pl-14"),
      )}>
        {/* Topbar — two stable flex groups */}
        <header className="h-14 bg-white border-b border-border/40 flex items-center px-3 md:px-4 sticky top-0 z-30 shadow-sm shadow-black/5 gap-2">
          {/* LEFT GROUP: toggle → search → breadcrumbs */}
          <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
            {/* Mobile hamburger */}
            <button
              className="md:hidden text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Tablet/desktop sidebar toggle */}
            <button
              className="hidden md:flex text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] items-center justify-center shrink-0"
              onClick={() => setSidebarToggled(!sidebarToggled)}
              aria-label="Toggle sidebar"
            >
              {isRailMode ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>

            {/* Search trigger — icon-only on tablet, full with text on desktop */}
            {isTablet ? (
              <button
                data-tour="search"
                onClick={() => window.dispatchEvent(new CustomEvent("toggle-command-palette"))}
                className="hidden md:flex lg:hidden items-center justify-center h-[44px] w-[44px] bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/50 rounded-lg text-slate-400 transition-colors shrink-0"
                aria-label={t("search", "Buscar...")}
              >
                <Search className="h-4 w-4 shrink-0" />
              </button>
            ) : (
              <button
                data-tour="search"
                onClick={() => window.dispatchEvent(new CustomEvent("toggle-command-palette"))}
                className="hidden lg:flex items-center gap-2 h-9 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/50 rounded-lg pl-3 pr-2 text-sm text-slate-400 transition-colors shrink-0 min-w-[120px] max-w-[200px]"
              >
                <Search className="h-3.5 w-3.5 shrink-0" />
                <span className="text-xs truncate">{t("search", "Buscar...")}</span>
                <kbd className="inline-flex h-5 items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 text-[10px] font-medium text-slate-400 shrink-0">
                  <Command className="h-2.5 w-2.5" />K
                </kbd>
              </button>
            )}

            {/* Breadcrumbs — min-w-0 so they truncate before pushing the search */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="hidden sm:flex items-center gap-1 text-sm min-w-0 overflow-hidden flex-1">
                {breadcrumbs.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-1 min-w-0">
                    {i > 0 && <span className="text-slate-300 shrink-0">/</span>}
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className={cn(
                          "text-slate-500 hover:text-primary transition-colors truncate",
                          isTablet && sidebarToggled ? "max-w-[80px]" : "max-w-[120px] md:max-w-[180px]"
                        )}
                      >{crumb.label}</Link>
                    ) : (
                      <span className={cn(
                        "text-slate-700 font-medium truncate",
                        isTablet && sidebarToggled ? "max-w-[80px]" : "max-w-[120px] md:max-w-[200px]"
                      )}>{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}
          </div>

          {/* RIGHT GROUP: language → role switcher → notifications */}
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            <LanguageToggle variant="compact" />

            {/* Role switcher — collapses to icon-only when sidebar open on tablet */}
            <div className="relative" data-tour="role-switcher">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center gap-1 md:gap-1.5 h-9 px-2 md:px-3 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/50 rounded-lg text-xs font-medium text-slate-600 transition-colors min-w-[44px]"
              >
                <Shield className="h-3.5 w-3.5 shrink-0" />
                {/* Hide label text always on tablet to save space */}
                {!isTablet && (
                  <span className="hidden sm:inline truncate max-w-[80px] md:max-w-[120px]">{activeRole.name}</span>
                )}
                <ChevronDown className="h-3 w-3 shrink-0" />
              </button>
              {showRoleSwitcher && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowRoleSwitcher(false)} />
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 max-h-72 overflow-y-auto">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{t("demoRoleSwitcher", "Demo Role Switcher")}</div>
                    {roles.map(role => (
                      <button
                        key={role.id}
                        onClick={() => { setActiveRole(role.id); setShowRoleSwitcher(false); }}
                        className={cn(
                          "w-full text-left px-3 py-2.5 text-sm hover:bg-slate-50 transition-colors min-h-[44px]",
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

            {/* Notifications */}
            <Link href="/admin/notifications" data-tour="notifications">
              <button className="relative p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-white"></span>}
              </button>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-auto w-full min-w-0">
          {children}
        </main>
      </div>
      <DemoMode />
    </div>
  );
}
