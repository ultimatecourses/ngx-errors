import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroupDirective, AbstractControl } from '@angular/forms';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ErrorDetails } from './ngxerrors';

@Directive({
  selector: '[ngxErrors]',
  exportAs: 'ngxErrors'
})
export class NgxErrorsDirective implements OnChanges {

  @Input('ngxErrors')
  controlName: string;

  subject = new BehaviorSubject<ErrorDetails>(null);

  control: AbstractControl;

  done: boolean = false;
  
  constructor(
    private form: FormGroupDirective
  ) {}

  get errors() {
    if (!this.done) return;
    return this.control.errors;
  }

  get hasErrors() {
    return !!this.errors;
  }
  
  hasError(name: string) {
    if (!this.done) return;
    return this.control.hasError(name);
  }

  getError(name: string) {
    if (!this.done) return;
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
    this.done = true;
    if (!errors) return;
    for (const error in errors) {
      this.subject.next({ control: this.control, errorName: error });
    }
  }

}