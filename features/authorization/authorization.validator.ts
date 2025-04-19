import { z } from "zod";
import { ROLES } from "./authorization.constants";

export const roleSchema = z.enum(ROLES);
