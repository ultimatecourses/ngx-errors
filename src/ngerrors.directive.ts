import { Directive, Input, OnInit } from '@angular/core';
import { FormGroupDirective, AbstractControl } from '@angular/forms';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ErrorDetails } from './ngerrors';

@Directive({
  selector: '[ngErrors]'
})
export class NgErrorsDirective implements OnInit {

  @Input('ngErrors')
  controlName: string;

  subject = new BehaviorSubject<ErrorDetails>(null);

  control: AbstractControl;

  constructor(
    private form: FormGroupDirective
  ) {}

  ngOnInit() {
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