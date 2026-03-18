import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CommandPalette } from "@/components/CommandPalette";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/public/Landing";
import Form from "@/pages/public/Form";
import FormLanding from "@/pages/public/FormLanding";
import ProposalView from "@/pages/public/ProposalView";
import ThankYou from "@/pages/public/ThankYou";
import Login from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import Leads from "@/pages/admin/Leads";
import LeadDetail from "@/pages/admin/LeadDetail";
import Pipeline from "@/pages/admin/Pipeline";
import Analytics from "@/pages/admin/Analytics";
import FollowUps from "@/pages/admin/FollowUps";
import Evaluations from "@/pages/admin/Evaluations";
import Offers from "@/pages/admin/Offers";
import Communications from "@/pages/admin/Communications";
import Team from "@/pages/admin/Team";
import Campaigns from "@/pages/admin/Campaigns";
import Automations from "@/pages/admin/Automations";
import Notifications from "@/pages/admin/Notifications";
import ActivityLog from "@/pages/admin/ActivityLog";
import Settings from "@/pages/admin/Settings";
import CalendarPage from "@/pages/admin/CalendarPage";
import BookingsPage from "@/pages/admin/BookingsPage";
import MeetingsPage from "@/pages/admin/MeetingsPage";
import BillingPage from "@/pages/admin/BillingPage";
import ProposalsPage from "@/pages/admin/ProposalsPage";
import InvoicesPage from "@/pages/admin/InvoicesPage";
import DocumentsPage from "@/pages/admin/DocumentsPage";
import ClientsPage from "@/pages/admin/ClientsPage";
import IntegrationsPage from "@/pages/admin/IntegrationsPage";
import TemplatesPage from "@/pages/admin/TemplatesPage";
import FormsPage from "@/pages/admin/FormsPage";
import LearningCenterPage from "@/pages/admin/LearningCenterPage";
import HRPage from "@/pages/admin/HRPage";
import { BookingSelect, BookingTimePicker, BookingDetails, BookingSuccess } from "@/pages/public/BookingFlow";
import { AgentBookingPage } from "@/pages/public/AgentBookingPage";
import Catalog from "@/pages/public/Catalog";
import CatalogDetail from "@/pages/public/CatalogDetail";
import About from "@/pages/public/About";
import Contact from "@/pages/public/Contact";
import ListingsPage from "@/pages/admin/ListingsPage";
import UserRoles from "@/pages/admin/UserRoles";
import AIAssistantSettings from "@/pages/admin/AIAssistantSettings";
import MessagingPage from "@/pages/admin/MessagingPage";
import SchedulingPage from "@/pages/admin/SchedulingPage";
import InMeetingPage from "@/pages/admin/InMeetingPage";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { useLocation } from "wouter";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/formulario/:id" component={FormLanding} />
      <Route path="/propuesta/:id" component={ProposalView} />
      <Route path="/formulario" component={Form} />
      <Route path="/gracias" component={ThankYou} />
      <Route path="/catalogo" component={Catalog} />
      <Route path="/catalogo/:id" component={CatalogDetail} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/book" component={BookingSelect} />
      <Route path="/book/success" component={BookingSuccess} />
      <Route path="/book/agent/:agentSlug" component={AgentBookingPage} />
      <Route path="/book/:eventType/details" component={BookingDetails} />
      <Route path="/book/:eventType" component={BookingTimePicker} />
      <Route path="/admin/login" component={Login} />
      <Route path="/admin/dashboard" component={Dashboard} />
      <Route path="/admin/leads" component={Leads} />
      <Route path="/admin/leads/:id" component={LeadDetail} />
      <Route path="/admin/pipeline" component={Pipeline} />
      <Route path="/admin/analytics" component={Analytics} />
      <Route path="/admin/follow-ups" component={FollowUps} />
      <Route path="/admin/evaluations" component={Evaluations} />
      <Route path="/admin/offers" component={Offers} />
      <Route path="/admin/communications" component={Communications} />
      <Route path="/admin/team" component={Team} />
      <Route path="/admin/campaigns" component={Campaigns} />
      <Route path="/admin/automations" component={Automations} />
      <Route path="/admin/notifications" component={Notifications} />
      <Route path="/admin/activity-log" component={ActivityLog} />
      <Route path="/admin/calendar" component={CalendarPage} />
      <Route path="/admin/bookings" component={BookingsPage} />
      <Route path="/admin/meetings" component={MeetingsPage} />
      <Route path="/admin/meeting/:id" component={InMeetingPage} />
      <Route path="/admin/billing" component={BillingPage} />
      <Route path="/admin/proposals" component={ProposalsPage} />
      <Route path="/admin/invoices" component={InvoicesPage} />
      <Route path="/admin/documents" component={DocumentsPage} />
      <Route path="/admin/clients" component={ClientsPage} />
      <Route path="/admin/integrations" component={IntegrationsPage} />
      <Route path="/admin/templates" component={TemplatesPage} />
      <Route path="/admin/listings" component={ListingsPage} />
      <Route path="/admin/user-roles" component={UserRoles} />
      <Route path="/admin/ai-assistant" component={AIAssistantSettings} />
      <Route path="/admin/messaging" component={MessagingPage} />
      <Route path="/admin/scheduling" component={SchedulingPage} />
      <Route path="/admin/forms" component={FormsPage} />
      <Route path="/admin/learning" component={LearningCenterPage} />
      <Route path="/admin/hr" component={HRPage} />
      <Route path="/admin/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function PublicChatbot() {
  const [location] = useLocation();
  const isPublicPage = !location.startsWith("/admin");
  if (!isPublicPage) return null;
  return <ChatbotWidget />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
          <CommandPalette />
          <PublicChatbot />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
