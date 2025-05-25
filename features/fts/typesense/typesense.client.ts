import Typesense from "typesense";
import { typesenseConfig } from "./typesense.constants";

export const typesenseClient = new Typesense.Client(typesenseConfig);
