import { Directive, Input, OnChanges, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroupDirective, AbstractControl } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';

import { ErrorDetails, ErrorOptions } from './ngxerrors';

import { toArray } from './utils/toArray';

@Directive({
  selector: '[ngxErrors]',
  exportAs: 'ngxErrors'
})
export class NgxErrorsDirective implements OnChanges, OnDestroy, AfterViewInit {

  @Input('ngxErrors')
  controlName: string;

  subject = new BehaviorSubject<ErrorDetails>(null);

  control: AbstractControl;

  ready: boolean = false;

  constructor(
    private form: FormGroupDirective
  ) { }

  get errors() {
    if (!this.ready) return;
    return this.control.errors;
  }

  get hasErrors() {
    return !!this.errors;
  }

  hasError(name: string, conditions: ErrorOptions): boolean {
    return this.checkPropState('invalid', name, conditions);
  }

  isValid(name: string, conditions: ErrorOptions): boolean {
    return this.checkPropState('valid', name, conditions);
  }

  getError(name: string) {
    if (!this.ready) return;
    return this.control.getError(name);
  }

  private checkPropState(prop: string, name: string, conditions: ErrorOptions): boolean {
    if (!this.ready) return;
    const controlPropsState = (
      !conditions || toArray(conditions).every((condition: string) => this.control[condition])
    );
    if (name.charAt(0) === '*') {
      return this.control[prop] && controlPropsState;
    }
    return (
      prop === 'valid' ? !this.control.hasError(name) : this.control.hasError(name) && controlPropsState
    );
  }

  private checkStatus() {
    const control = this.control;
    const errors = control.errors;
    this.ready = true;
    if (!errors) return;
    for (const errorName in errors) {
      this.subject.next({ control, errorName });
    }
  }

  ngOnChanges() {
    this.control = this.form.control.get(this.controlName);
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.checkStatus();
      this.control.statusChanges.subscribe(this.checkStatus.bind(this));
    });
  }

  ngOnDestroy() {
    this.subject.unsubscribe();
  }

}