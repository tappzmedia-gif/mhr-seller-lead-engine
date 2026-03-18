import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge } from "@/components/ui-components";
import { cn } from "@/lib/utils";
import { Shield, Plus, Edit3, Trash2, X, Check, Users } from "lucide-react";
import { getRoles, addRole, updateRole, deleteRole, ALL_MODULES, type Role, type RolePermission } from "@/store/roles-store";

export default function UserRoles() {
  const [roles, setRoles] = useState(getRoles);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");

  useEffect(() => {
    const handler = () => setRoles(getRoles());
    window.addEventListener("role-updated", handler);
    return () => window.removeEventListener("role-updated", handler);
  }, []);

  const handleCreateRole = () => {
    if (!newRoleName.trim()) return;
    addRole({
      name: newRoleName,
      description: newRoleDesc,
      permissions: ALL_MODULES.map(m => ({ module: m, view: false, edit: false })),
      isSystem: false,
    });
    setNewRoleName("");
    setNewRoleDesc("");
    setShowCreateModal(false);
    setRoles(getRoles());
  };

  const handleTogglePermission = (roleId: string, module: string, field: "view" | "edit") => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;
    const updatedPermissions = role.permissions.map(p => {
      if (p.module === module) {
        const updated = { ...p, [field]: !p[field] };
        if (field === "edit" && !p[field]) updated.view = true;
        if (field === "view" && p[field]) updated.edit = false;
        return updated;
      }
      return p;
    });
    updateRole(roleId, { permissions: updatedPermissions });
    setRoles(getRoles());
  };

  const handleDeleteRole = (id: string) => {
    deleteRole(id);
    setRoles(getRoles());
    if (editingRole?.id === id) setEditingRole(null);
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-900">User Roles</h1>
            <p className="text-sm text-slate-500 mt-1">Gestiona roles y permisos por módulo.</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" /> Crear Rol
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map(role => (
            <Card
              key={role.id}
              className={cn(
                "shadow-sm cursor-pointer transition-all hover:shadow-md",
                editingRole?.id === role.id ? "border-primary ring-2 ring-primary/20" : "border-slate-200"
              )}
              onClick={() => setEditingRole(role)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  {role.isSystem && <Badge variant="secondary" className="text-[10px]">Sistema</Badge>}
                </div>
                <h3 className="font-bold text-slate-900">{role.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{role.description}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                  <Users className="h-3 w-3" />
                  <span>{role.permissions.filter(p => p.view).length} módulos visibles</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {editingRole && (
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Permisos: {editingRole.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                {!editingRole.isSystem && (
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteRole(editingRole.id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingRole(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-500 border-b border-slate-100">
                      <th className="text-left py-3 font-medium px-3">Módulo</th>
                      <th className="text-center py-3 font-medium w-24">Ver</th>
                      <th className="text-center py-3 font-medium w-24">Editar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editingRole.permissions.map(perm => (
                      <tr key={perm.module} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-medium text-slate-700">{perm.module}</td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => handleTogglePermission(editingRole.id, perm.module, "view")}
                            className={cn(
                              "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors mx-auto",
                              perm.view ? "bg-primary border-primary text-white" : "border-slate-300 hover:border-primary"
                            )}
                          >
                            {perm.view && <Check className="h-3.5 w-3.5" />}
                          </button>
                        </td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => handleTogglePermission(editingRole.id, perm.module, "edit")}
                            className={cn(
                              "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors mx-auto",
                              perm.edit ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 hover:border-emerald-500"
                            )}
                          >
                            {perm.edit && <Check className="h-3.5 w-3.5" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {showCreateModal && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowCreateModal(false)} />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md shadow-2xl border-slate-200">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-slate-900">Crear Nuevo Rol</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowCreateModal(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre del rol</label>
                    <Input value={newRoleName} onChange={e => setNewRoleName(e.target.value)} placeholder="Ej: Analyst" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción</label>
                    <Input value={newRoleDesc} onChange={e => setNewRoleDesc(e.target.value)} placeholder="Descripción breve del rol" />
                  </div>
                </div>
                <div className="p-5 border-t border-slate-100 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancelar</Button>
                  <Button onClick={handleCreateRole} disabled={!newRoleName.trim()}>Crear Rol</Button>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
