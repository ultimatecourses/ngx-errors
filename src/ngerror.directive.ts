import { Directive, Input, OnInit, OnDestroy, DoCheck, Inject, HostBinding, forwardRef } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/combineLatest';

import { NgErrorsDirective } from './ngerrors.directive';

import { ErrorOptions } from './ngerrors';

import { toArray } from './utils/toArray';

@Directive({
  selector: '[ngError]'
})
export class NgErrorDirective implements OnInit, OnDestroy, DoCheck {

  @Input() set ngError(value: ErrorOptions) {
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

  _states = new Subject<string[]>();
  
  states = this._states.asObservable().distinctUntilChanged();

  constructor(
    @Inject(forwardRef(() => NgErrorsDirective)) private ngErrors: NgErrorsDirective
  ) {}
  
  ngOnInit() {

    const errors = this.ngErrors.subject
      .filter(obj => this.errorNames.includes(obj.errorName));

    const states = this.states
      .map(states => this.rules.every(rule => states.includes(rule)));

    this.subscription = Observable.combineLatest(states, errors)
      .subscribe(([states, errors]) => {
        this.hidden = !(states && errors.control.hasError(errors.errorName));
      });

  }

  ngDoCheck() {
    this._states.next(
      this.rules.filter((rule) => (this.ngErrors.control as any)[rule])
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}