import { ErrorOptions } from "../ngxerrors";

export const toArray = (value: ErrorOptions): string[] => Array.isArray(value) ? value : [value];
