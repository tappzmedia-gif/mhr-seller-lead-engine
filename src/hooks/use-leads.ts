import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type Lead, type LeadStatus } from "@/lib/mock-data";
import { leadsStore, getLeads, getLeadById, updateLead, addLead, addActivityToLead } from "@/store";

export function getLeadsStore(): Lead[] {
  return leadsStore;
}

export function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 100));
      return getLeads();
    },
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ["leads", id],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 50));
      const lead = getLeadById(id);
      if (!lead) throw new Error("Lead not found");
      return lead;
    },
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Lead, "id" | "entryDate" | "score" | "scoreCategory" | "owner" | "status" | "priority" | "activities">) => {
      await new Promise(r => setTimeout(r, 300));
      let score = 50;
      if (data.timeline === "Urgente") score += 30;
      if (data.condition === "Deteriorada" || data.condition === "Muy deteriorada") score += 15;
      if (data.situation.includes("Herencia") || data.situation.includes("Deudas")) score += 15;
      if (data.timeline === "Solo evaluando") score -= 30;

      const newLead: Lead = {
        ...data,
        id: `LD-${Math.floor(Math.random() * 10000) + 3000}`,
        entryDate: new Date().toISOString(),
        score,
        scoreCategory: score >= 85 ? 'Hot' : score >= 60 ? 'High' : score >= 30 ? 'Medium' : 'Low',
        owner: "Unassigned",
        status: "New",
        priority: score >= 80 ? "Urgent" : score >= 60 ? "High" : "Normal",
        nextFollowUp: null,
        tags: [],
        activities: [
          {
            id: Math.random().toString(),
            type: "System",
            description: "Lead capturado vía formulario web",
            date: new Date().toISOString(),
            author: "System"
          }
        ]
      };

      addLead(newLead);
      return newLead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<Lead> & { id: string }) => {
      await new Promise(r => setTimeout(r, 100));
      const updated = updateLead(updates.id, updates);
      if (!updated) throw new Error("Lead not found");
      return updated;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["leads", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}

export function useAddActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ leadId, activity }: { leadId: string, activity: Omit<Lead['activities'][0], 'id' | 'date'> }) => {
      const newActivity = {
        ...activity,
        id: Math.random().toString(),
        date: new Date().toISOString(),
      };
      addActivityToLead(leadId, newActivity);
      return newActivity;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["leads", variables.leadId] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
