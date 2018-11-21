import { Directive, DoCheck, forwardRef, HostBinding, Inject, Input, OnDestroy, OnInit } from "@angular/core";

import { combineLatest, Observable, pipe, Subject, Subscription} from "rxjs";
// import 'rxjs/add/operator/filter';
// import 'rxjs/add/operator/map';
import { distinctUntilChanged ,  filter, map } from "rxjs/operators";

import { NgxErrorsDirective } from "./ngxerrors.directive";

import { ErrorOptions } from "./ngxerrors";

import { toArray } from "./utils/toArray";

@Directive({
  selector: "[ngxError]",
})
export class NgxErrorDirective implements OnInit, OnDestroy, DoCheck {

  @Input() set ngxError(value: ErrorOptions) {
    this.errorNames = toArray(value);
  }

  @Input() set when(value: ErrorOptions) {
    this.rules = toArray(value);
  }

  @HostBinding("hidden")
  public hidden: boolean = true;

  public rules: string[] = [];

  public errorNames: string[] = [];

  public subscription: Subscription;

  public _states: Subject<string[]>;

  public states: Observable<string[]>;

  constructor(
    @Inject(forwardRef(() => NgxErrorsDirective)) private ngxErrors: NgxErrorsDirective,
  ) { }

  public ngOnInit() {

    this._states = new Subject<string[]>();
    this.states = this._states.asObservable().pipe(distinctUntilChanged());

    const errors = this.ngxErrors.subject
    .pipe(filter(Boolean))
      .pipe(filter((obj) => !!~this.errorNames.indexOf(obj.errorName)));

    const states = this.states.pipe(
      map((states) => this.rules.every((rule) => !!~states.indexOf(rule))));

    this.subscription = combineLatest(states, errors)
      .subscribe(([states, errors]) => {
        this.hidden = !(states && errors.control.hasError(errors.errorName));
      });

  }

  public ngDoCheck() {
    this._states.next(
      this.rules.filter((rule) => (this.ngxErrors.control as any)[rule]),
    );
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
