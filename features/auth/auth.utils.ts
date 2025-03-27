type canAccessProps = {
  role: "admin" | "user";
  resource: "admin" | "user";
};
export const canAccess = (opts: canAccessProps) => {
  return (
    opts.role === "admin" || (opts.role === "user" && opts.resource !== "admin")
  );
};
