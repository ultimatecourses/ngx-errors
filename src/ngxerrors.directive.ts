import { Directive, Input, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { FormGroupDirective, AbstractControl } from '@angular/forms';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ErrorDetails } from './ngxerrors';

import { ErrorOptions } from './ngxerrors';

import { toArray } from './utils/toArray';

@Directive({
  selector: '[ngxErrors]',
  exportAs: 'ngxErrors'
})
export class NgxErrorsDirective implements OnChanges, AfterViewInit {

  @Input('ngxErrors')
  controlName: string;

  subject = new BehaviorSubject<ErrorDetails>(null);

  control: AbstractControl;

  ready: boolean = false;
  
  constructor(
    private form: FormGroupDirective
  ) {}

  get errors() {
    if (!this.ready) return;
    return this.control.errors;
  }

  get hasErrors() {
    return !!this.errors;
  }

  checkControlProps(props: ErrorOptions) {
    return (
      !props ? true : toArray(props).every((prop: string) => this.control[prop])
    );
  }
  
  hasError(name: string, conditions: ErrorOptions): boolean {
    if (!this.ready) return;
    return this.control.hasError(name) && this.checkControlProps(conditions);
  }

  getError(name: string) {
    if (!this.ready) return;
    return this.control.getError(name);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.checkStatus();
      this.control.statusChanges.subscribe(this.checkStatus.bind(this));
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.control = this.form.control.get(changes.controlName.currentValue);
  }

  checkStatus() {
    const errors = this.control.errors;
    this.ready = true;
    if (!errors) return;
    for (const error in errors) {
      this.subject.next({ control: this.control, errorName: error });
    }
  }

}