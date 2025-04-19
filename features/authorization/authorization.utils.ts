import {
  Resource,
  Role,
  Action,
  Scope,
  PERMISSIONS,
} from "./authorization.constants";

export const getScope = ({
  resource,
  role,
  action,
}: {
  resource: Resource;
  role: Role;
  action: Action;
}): Scope[] | undefined => {
  if (role === "admin") return ["all"];

  return PERMISSIONS[role]?.[resource]?.[action];
};
