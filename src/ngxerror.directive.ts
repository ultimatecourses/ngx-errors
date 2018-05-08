import { Directive, Input, OnInit, OnDestroy, DoCheck, Inject, HostBinding, forwardRef } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/combineLatest';

import { NgxErrorsDirective } from './ngxerrors.directive';

import { ErrorOptions } from './ngxerrors';

import { toArray } from './utils/toArray';

@Directive({
  selector: '[ngxError]'
})
export class NgxErrorDirective implements OnInit, OnDestroy, DoCheck {

  @Input() set ngxError(value: ErrorOptions) {
    this.errorNames = toArray(value);
  }

  @Input() set when(value: ErrorOptions) {
    this.rules = toArray(value);
  }

  @HostBinding('hidden')
  hidden: boolean = true;

  rules: string[] = [];

  errorNames: string[] = [];

  subscription: Subscription;

  _states: Subject<string[]>;

  states: Observable<string[]>;

  constructor(
    @Inject(forwardRef(() => NgxErrorsDirective)) private ngxErrors: NgxErrorsDirective
  ) { }

  ngOnInit() {

    this._states = new Subject<string[]>();
    this.states = this._states.asObservable().distinctUntilChanged();

    const errors = this.ngxErrors.subject
      .filter(Boolean)
      .filter(obj => !!~this.errorNames.indexOf(obj.errorName));

    const states = this.states
      .map(states => this.rules.every(rule => !!~states.indexOf(rule)));

    this.subscription = Observable.combineLatest(states, errors)
      .subscribe(([states, errors]) => {
        this.hidden = !(states && errors.control.hasError(errors.errorName));
      });

  }

  ngDoCheck() {
    this._states.next(
      this.rules.filter((rule) => (this.ngxErrors.control as any)[rule])
    );
  }

  ngOnDestroy() {
    this._states.complete();
    this.subscription.unsubscribe();
  }

}
