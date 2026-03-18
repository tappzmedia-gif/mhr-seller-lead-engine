import { useQuery } from "@tanstack/react-query";
import { getLeadsStore } from "./use-leads";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const leads = getLeadsStore();

      const total = leads.length;
      const newLeads = leads.filter(l => l.status === "New").length;
      const urgent = leads.filter(l => l.priority === "Urgent").length;
      const qualified = leads.filter(l => l.status === "Qualified" || l.status === "Evaluation Pending").length;
      const contacted = leads.filter(l => !["New", "Attempted Contact"].includes(l.status)).length;
      const won = leads.filter(l => l.status === "Won").length;
      const lost = leads.filter(l => l.status === "Lost").length;

      const bySource: Record<string, number> = {};
      const byRegion: Record<string, number> = {};
      leads.forEach(l => {
        bySource[l.source] = (bySource[l.source] || 0) + 1;
        byRegion[l.region] = (byRegion[l.region] || 0) + 1;
      });

      return {
        total,
        newLeads,
        urgent,
        qualified,
        contacted,
        won,
        lost,
        conversionRate: total > 0 ? ((won / total) * 100).toFixed(1) : "0.0",
        opportunities: leads.filter(l => ["Evaluation Pending", "Offer Review", "Negotiation"].includes(l.status)).length,
      };
    }
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const leads = getLeadsStore();

      const bySource: Record<string, number> = {};
      const byRegion: Record<string, number> = {};
      leads.forEach(l => {
        bySource[l.source] = (bySource[l.source] || 0) + 1;
        byRegion[l.region] = (byRegion[l.region] || 0) + 1;
      });

      const sources = Object.entries(bySource)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      const regions = Object.entries(byRegion)
        .map(([region, leads]) => ({ region, leads }))
        .sort((a, b) => b.leads - a.leads);

      const won = leads.filter(l => l.status === "Won").length;

      const funnel = [
        { stage: "Captados", count: leads.length },
        { stage: "Contactados", count: leads.filter(l => !["New", "Attempted Contact"].includes(l.status)).length },
        { stage: "Calificados", count: leads.filter(l => ["Qualified", "Evaluation Pending", "Offer Review", "Negotiation", "Won"].includes(l.status)).length },
        { stage: "Ofertas", count: leads.filter(l => ["Offer Review", "Negotiation", "Won"].includes(l.status)).length },
        { stage: "Cierres", count: won },
      ];

      return { sources, regions, funnel };
    }
  });
}
