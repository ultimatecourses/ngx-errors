import { Directive, Input, OnInit } from '@angular/core';
import { FormGroupDirective, AbstractControl } from '@angular/forms';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ErrorDetails } from './ngxerrors';

@Directive({
  selector: '[ngErrors],[ngxErrors]'
})
export class NgxErrorsDirective implements OnInit {

  @Input('ngxErrors')
  controlName: string;

  @Input('ngErrors') set ngErrors(value) {
    this.controlName = value;
    console.warn('Warning: You are using the [ngErrors] directive which has been deprecated and will be removed in the next release. Use [ngxErrors] instead.');
  }

  subject: BehaviorSubject<ErrorDetails>;

  control: AbstractControl;

  constructor(
    private form: FormGroupDirective
  ) {}

  ngOnInit() {
    this.subject = new BehaviorSubject<ErrorDetails>(null);
    this.control = this.form.control.get(this.controlName);
    this.control.statusChanges.subscribe(this.checkStatus.bind(this));
    this.checkStatus();
  }

  checkStatus() {
    const errors = this.control.errors;
    if (!errors) return;
    for (const error in errors) {
      this.subject.next({ control: this.control, errorName: error });
    }
  }

}