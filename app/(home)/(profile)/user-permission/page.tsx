import { PERMISSIONS } from "@/features/authorization/authorization.constants";

const SHOWN_ROLES: (keyof typeof PERMISSIONS)[] = ["admin", "seller"];

const ACTION_LABELS: Record<"view" | "create" | "modify" | "delete", string> = {
  view: "Xem",
  create: "Tạo",
  modify: "Chỉnh sửa",
  delete: "Xóa",
};

const ACTIONS = Object.keys(ACTION_LABELS) as (keyof typeof ACTION_LABELS)[];

const PermissionsPage = () => {
  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Quyền theo vai trò</h1>

      {SHOWN_ROLES.map((role) => {
        const rolePermissions = PERMISSIONS[role];
        if (!rolePermissions) return null;

        return (
          <div key={role} className="mb-10">
            <h2 className="text-xl font-semibold capitalize text-primary mb-4">
              {role}
            </h2>

            {ACTIONS.map((action) => {
              const resources = Object.entries(rolePermissions)
                .filter(([, actions]) => actions?.[action])
                .map(([resource]) => resource);

              if (resources.length === 0) return null;

              return (
                <div key={action} className="mb-4">
                  <h3 className="font-medium capitalize text-muted-foreground mb-1">
                    {ACTION_LABELS[action]}
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {resources.map((resource) => (
                      <li
                        key={`${role}-${action}-${resource}`}
                        className="px-3 py-1 text-sm bg-muted rounded border"
                      >
                        {resource}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default PermissionsPage;
