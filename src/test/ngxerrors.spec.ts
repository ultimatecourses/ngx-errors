import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { Component, DebugElement } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { NgxErrorsModule } from '../ngxerrors.module';
import { NgxErrorDirective } from '../ngxerror.directive';

import { By } from '@angular/platform-browser';

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

@Component({
  template: `
    <form [formGroup]="form">      
      <input formControlName="prop">
      <div ngxErrors="prop">
        <div ngxError="required" [when]="dirty">
          Required
        </div>
        <div [ngxError]="['minlength', 'maxlength']" [when]="['dirty', 'touched']">
          5 characters minimum, 10 characters maximum
        </div>
      </div>
    </form>
  `
})
class AppComponent {
  form = this.fb.group({
    prop: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]]
  });
  constructor(private fb: FormBuilder) {}
}

describe('Directives: ngxErrors, ngxError, when', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let el: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NgxErrorsModule
      ],
      declarations: [
        AppComponent
      ]
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should hide all ngxError directives on load', () => {

    const elements = el.queryAll(By.directive(NgxErrorDirective));
    expect(elements.every((element) => element.nativeElement.hasAttribute('hidden'))).toBe(true);

  });

  it('should show ngxError[required] when required is true', async () => {

    const element = el.queryAll(By.directive(NgxErrorDirective))[0];

    component.form.patchValue({ prop: 'ngxErrors' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(element.nativeElement.hasAttribute('hidden')).toBe(true);
    expect(component.form.get('prop').hasError('required')).toBe(true);

    component.form.patchValue({ prop: '' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(element.nativeElement.hasAttribute('hidden')).toBe(false);
    expect(component.form.get('prop').hasError('required')).toBe(false);

  });

  it('should show ngxError[minlength] or ngxError[maxlength] when either are true', async () => {

    const element = el.queryAll(By.directive(NgxErrorDirective))[1];
    expect(component.form.get('prop').touched).toBe(false);
    component.form.patchValue({ prop: 'ngxErrors' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.get('prop').touched).toBe(true);
    expect(element.nativeElement.hasAttribute('hidden')).toBe(true);
    expect(component.form.get('prop').hasError('minlength')).toBe(false);
    expect(component.form.get('prop').hasError('maxlength')).toBe(false);

    component.form.patchValue({ prop: 'ngx' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(element.nativeElement.hasAttribute('hidden')).toBe(false);
    expect(component.form.get('prop').hasError('minlength')).toBe(true);
    expect(component.form.get('prop').hasError('maxlength')).toBe(false);

    component.form.patchValue({ prop: 'ngxErrors!!!!!' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(element.nativeElement.hasAttribute('hidden')).toBe(false);
    expect(component.form.get('prop').hasError('minlength')).toBe(false);
    expect(component.form.get('prop').hasError('maxlength')).toBe(true);

  });

});