// warning: crypto may make mongoose model undefined if import model in this file
import crypto from "crypto";

type canAccessProps = {
  role: "admin" | "user";
  resource: "admin" | "user";
};
export const canAccess = (opts: canAccessProps) => {
  return (
    opts.role === "admin" || (opts.role === "user" && opts.resource !== "admin")
  );
};

export const createVerificationToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
};
