export interface RolePermission {
  module: string;
  view: boolean;
  edit: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: RolePermission[];
  isSystem: boolean;
}

const ALL_MODULES = [
  "Dashboard", "Lead Center", "Pipeline", "Analytics", "Follow-ups",
  "Listings", "Evaluations", "Offers", "Communications", "Messaging", "Campaigns",
  "Calendar", "Bookings", "Scheduling", "Meetings", "Clients", "Documents", "Forms",
  "Billing", "Proposals", "Invoices",
  "Team", "User Roles", "AI Assistant", "Automations", "Activity Log", "Notifications", "Integrations", "Templates", "Learning", "HR", "Settings",
];

function makePermissions(viewAll: boolean, editAll: boolean, overrides?: Record<string, { view?: boolean; edit?: boolean }>): RolePermission[] {
  return ALL_MODULES.map(mod => ({
    module: mod,
    view: overrides?.[mod]?.view ?? viewAll,
    edit: overrides?.[mod]?.edit ?? editAll,
  }));
}

let roles: Role[] = [
  {
    id: "role-admin", name: "Admin", description: "Acceso total al sistema",
    permissions: makePermissions(true, true), isSystem: true,
  },
  {
    id: "role-manager", name: "Manager", description: "Gestión de equipo y operaciones",
    permissions: makePermissions(true, true, { Settings: { view: true, edit: false }, Integrations: { view: true, edit: false } }), isSystem: true,
  },
  {
    id: "role-agent", name: "Agent", description: "Gestión de leads y seguimientos",
    permissions: makePermissions(true, false, {
      "Lead Center": { view: true, edit: true }, Pipeline: { view: true, edit: true },
      "Follow-ups": { view: true, edit: true }, Evaluations: { view: true, edit: true },
      Offers: { view: true, edit: false }, Communications: { view: true, edit: true },
      Calendar: { view: true, edit: true }, Bookings: { view: true, edit: true },
      Team: { view: false, edit: false }, Automations: { view: false, edit: false },
      Settings: { view: false, edit: false }, Integrations: { view: false, edit: false },
      Billing: { view: false, edit: false }, Invoices: { view: false, edit: false },
    }), isSystem: true,
  },
  {
    id: "role-closer", name: "Closer", description: "Especialista en negociación y cierre",
    permissions: makePermissions(false, false, {
      Dashboard: { view: true, edit: false }, "Lead Center": { view: true, edit: true },
      Pipeline: { view: true, edit: true }, Offers: { view: true, edit: true },
      Evaluations: { view: true, edit: false }, Communications: { view: true, edit: true },
      "Follow-ups": { view: true, edit: true },
    }), isSystem: true,
  },
  {
    id: "role-marketing", name: "Marketing", description: "Campañas y análisis de fuentes",
    permissions: makePermissions(false, false, {
      Dashboard: { view: true, edit: false }, Analytics: { view: true, edit: false },
      Campaigns: { view: true, edit: true }, "Lead Center": { view: true, edit: false },
      Templates: { view: true, edit: true },
    }), isSystem: true,
  },
  {
    id: "role-support", name: "Support", description: "Atención al cliente y seguimiento",
    permissions: makePermissions(false, false, {
      Dashboard: { view: true, edit: false }, "Lead Center": { view: true, edit: false },
      Communications: { view: true, edit: true }, "Follow-ups": { view: true, edit: true },
      Notifications: { view: true, edit: true },
    }), isSystem: true,
  },
  {
    id: "role-finance", name: "Finance", description: "Facturación y propuestas financieras",
    permissions: makePermissions(false, false, {
      Dashboard: { view: true, edit: false }, Billing: { view: true, edit: true },
      Proposals: { view: true, edit: true }, Invoices: { view: true, edit: true },
      Offers: { view: true, edit: false },
    }), isSystem: true,
  },
  {
    id: "role-hr", name: "HR", description: "Gestión de personal",
    permissions: makePermissions(false, false, {
      Dashboard: { view: true, edit: false }, Team: { view: true, edit: true },
      "Activity Log": { view: true, edit: false }, HR: { view: true, edit: true },
      Learning: { view: true, edit: true },
    }), isSystem: true,
  },
];

let activeRoleId = "role-admin";

export function getRoles(): Role[] {
  return roles.map(r => ({ ...r, permissions: r.permissions.map(p => ({ ...p })) }));
}

export function getRoleById(id: string): Role | undefined {
  return roles.find(r => r.id === id);
}

export function getActiveRole(): Role {
  return roles.find(r => r.id === activeRoleId) || roles[0];
}

export function setActiveRole(roleId: string): void {
  activeRoleId = roleId;
  window.dispatchEvent(new CustomEvent("role-updated"));
}

export function addRole(role: Omit<Role, "id">): Role {
  const newRole: Role = { ...role, id: `role-${Date.now()}`, permissions: role.permissions.map(p => ({ ...p })) };
  roles = [...roles, newRole];
  window.dispatchEvent(new CustomEvent("role-updated"));
  return newRole;
}

export function updateRole(id: string, updates: Partial<Role>): Role | null {
  let updated: Role | null = null;
  roles = roles.map(r => {
    if (r.id === id) {
      updated = { ...r, ...updates };
      return updated;
    }
    return r;
  });
  window.dispatchEvent(new CustomEvent("role-updated"));
  return updated;
}

export function deleteRole(id: string): boolean {
  const role = roles.find(r => r.id === id);
  if (!role || role.isSystem) return false;
  roles = roles.filter(r => r.id !== id);
  window.dispatchEvent(new CustomEvent("role-updated"));
  return true;
}

export function getVisibleModules(): string[] {
  const role = getActiveRole();
  return role.permissions.filter(p => p.view).map(p => p.module);
}

export { ALL_MODULES };
