import {
  Resource,
  Role,
  Action,
  Scope,
  PERMISSIONS,
  ROLES,
} from "./authorization.constants";

export const getScope = ({
  resources,
  role,
  action,
}: {
  resources: Resource;
  role: Role;
  action: Action;
}): Scope | undefined => {
  return PERMISSIONS[role]?.[resources]?.[action];
};

export const canAccess = ({
  resources,
  role,
  action,
  scope,
}: {
  resources: Resource;
  role: Role;
  action: Action;
  scope: Scope;
}) => {
  if (role === ROLES.ADMIN) return true;

  return PERMISSIONS[role]?.[resources]?.[action] === scope;
};
