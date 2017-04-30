import { AbstractControl, FormGroupDirective } from '@angular/forms';

export type ErrorOptions = string | string[];

export interface ErrorDetails {
  control?: AbstractControl,
  form?: FormGroupDirective,
  errorName: string
}
