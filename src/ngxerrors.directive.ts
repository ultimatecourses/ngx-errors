import { AfterViewInit, Directive, Input, OnChanges, OnDestroy } from "@angular/core";
import { AbstractControl, FormGroupDirective } from "@angular/forms";

import { BehaviorSubject } from "rxjs-compat/BehaviorSubject";

import { ErrorDetails, ErrorOptions } from "./ngxerrors";

import { toArray } from "./utils/toArray";

@Directive({
  selector: "[ngxErrors]",
  exportAs: "ngxErrors",
})
export class NgxErrorsDirective implements OnChanges, OnDestroy, AfterViewInit {

  get errors() {
    if (!this.ready) { return; }
    return this.control.errors;
  }

  get hasErrors() {
    return !!this.errors;
  }

  @Input("ngxErrors")
  public controlName: string;

  public subject = new BehaviorSubject<ErrorDetails>(null);

  public control: AbstractControl;

  public ready: boolean = false;

  constructor(
    private form: FormGroupDirective,
  ) { }

  public hasError(name: string, conditions: ErrorOptions): boolean {
    return this.checkPropState("invalid", name, conditions);
  }

  public isValid(name: string, conditions: ErrorOptions): boolean {
    return this.checkPropState("valid", name, conditions);
  }

  public getError(name: string) {
    if (!this.ready) { return; }
    return this.control.getError(name);
  }

  public ngOnChanges() {
    this.control = this.form.control.get(this.controlName);
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      this.checkStatus();
      this.control.statusChanges.subscribe(this.checkStatus.bind(this));
    });
  }

  public ngOnDestroy() {
    this.subject.unsubscribe();
  }

  private checkPropState(prop: string, name: string, conditions: ErrorOptions): boolean {
    if (!this.ready) { return; }
    const controlPropsState = (
      !conditions || toArray(conditions).every((condition: string) => this.control[condition])
    );
    if (name.charAt(0) === "*") {
      return this.control[prop] && controlPropsState;
    }
    return (
      prop === "valid" ? !this.control.hasError(name) : this.control.hasError(name) && controlPropsState
    );
  }

  private checkStatus() {
    const control = this.control;
    const errors = control.errors;
    this.ready = true;
    if (!errors) { return; }
    for (const errorName in errors) {
      this.subject.next({ control, errorName });
    }
  }

}
