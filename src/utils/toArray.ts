import { ErrorOptions } from '../ngerrors';

export const toArray = (value: ErrorOptions): string[] => Array.isArray(value) ? value : [value];