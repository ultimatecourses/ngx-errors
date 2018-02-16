import { Directive, Input, OnChanges, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroupDirective, AbstractControl } from '@angular/forms';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
    public form: FormGroupDirective,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  get errors() {
    if (!this.ready) return;
    if (this.control) {
      return this.control.errors;
    }
    return this.form.errors;
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
    if (this.control) {
      return this.control.getError(name);
    }
    return this.form.getError(name);
  }

  private checkPropState(prop: string, name: string, conditions: ErrorOptions): boolean {
    if (!this.ready) return;
    const propsState = (
      !conditions || toArray(conditions).every(
        (condition: string) =>
          this.control ? this.control[condition] : this.form[condition]
      )
    );
    if (name.charAt(0) === '*') {
      if (this.control) {
        return this.control[prop] && propsState;
      }
      return this.form[prop] && propsState;
    }
    if (this.control) {
      return (
        prop === 'valid' ? !this.control.hasError(name) : this.control.hasError(name) && propsState
      );
    }
    return (
      prop === 'valid' ? !this.form.hasError(name) : this.form.hasError(name) && propsState
    );
  }

  private checkStatus() {
    const control = this.control;
    const form = this.form;
    const errors = control ? control.errors : form.errors;
    this.ready = true;
    if (!errors) return;
    for (const errorName in errors) {
      if (this.control) {
        this.subject.next({ control, errorName });
      } else {
        this.subject.next({ form, errorName });

        // why does this seem necessary? I don't understand
        this.changeDetectorRef.detectChanges();
      }
    }
  }

  ngOnChanges() {
    if (this.controlName) {
      this.control = this.form.control.get(this.controlName);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.checkStatus();
      if (this.control) {
        this.control.statusChanges.subscribe(this.checkStatus.bind(this));
      } else {
        this.form.statusChanges.subscribe(this.checkStatus.bind(this));
      }
    });
  }

  ngOnDestroy() {
    this.subject.unsubscribe();
  }

}
