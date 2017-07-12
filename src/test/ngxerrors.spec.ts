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
      <input 
        class="prop"
        formControlName="prop"
        [ngClass]="{
          requiredVisibleAtRuntime: prop.hasError('required'),
          requiredVisibleWhenDirty: prop.hasError('required', ['dirty']),
          requiredVisibleWhenDirtyTouched: prop.hasError('required', ['dirty', 'touched']),
          visibleAnyErrorDirtyTouched: prop.hasError('*', ['dirty', 'touched'])
        }">
      <div class="errorProps">
        <div class="errorProp1">{{ prop.errors | json }}</div>
        <div class="errorProp2">{{ prop.hasErrors | json }}</div>
        <div class="errorProp3">{{ prop.isValid('*', ['dirty']) | json }}</div>
        <div class="errorProp4">{{ prop.isValid('required', ['dirty']) | json }}</div>
      </div>
      <div ngxErrors="prop" #prop="ngxErrors">
        <div ngxError="required" when="dirty">
          Required
        </div>
        <div class="errorMinLength" [ngxError]="['minlength', 'maxlength']" [when]="['dirty', 'touched']">
          {{ prop.getError('minlength')?.requiredLength }} characters minimum, {{ prop.getError('maxlength')?.requiredLength }} characters maximum
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
        NgxErrorsModule.forRoot()
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

  it('should show ngxError[required] when required is true and dirty', async (done) => {

    const element = el.queryAll(By.directive(NgxErrorDirective))[0];

    expect(component.form.get('prop').dirty).toBe(false);
    component.form.patchValue({ prop: 'ngxErrors' });
    component.form.get('prop').markAsDirty();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.get('prop').dirty).toBe(true);
    expect(element.nativeElement.hasAttribute('hidden')).toBe(true);
    expect(component.form.get('prop').hasError('required')).toBe(false);

    component.form.patchValue({ prop: null });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(element.nativeElement.hasAttribute('hidden')).toBe(false);
    expect(component.form.get('prop').hasError('required')).toBe(true);

    done();

  });

  it('should show ngxError[minlength | maxlength] when either are true, touched and dirty', async (done) => {

    const element = el.queryAll(By.directive(NgxErrorDirective))[1];
    expect(component.form.get('prop').dirty).toBe(false);
    expect(component.form.get('prop').touched).toBe(false);
    component.form.patchValue({ prop: 'ngxErrors' });
    component.form.get('prop').markAsDirty();
    component.form.get('prop').markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.get('prop').dirty).toBe(true);
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

    done();

  });

  it('should provide a template ref API via ngxErrors exportAs', async (done) => {

    const parse = (name) => JSON.parse(el.query(By.css(name)).nativeElement.textContent);

    await fixture.whenStable();

    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();

    const element = el.query(By.css('input.prop'));
    expect(element.nativeElement.classList.contains('requiredVisibleAtRuntime')).toBe(true);
    expect(element.nativeElement.classList.contains('requiredVisibleWhenDirty')).toBe(false);
    expect(element.nativeElement.classList.contains('requiredVisibleWhenDirtyTouched')).toBe(false);
    expect(parse('.errorProp3')).toBe(false);
    expect(parse('.errorProp4')).toBe(false);

    component.form.patchValue({ prop: 'ngxErrors' });
    component.form.get('prop').markAsDirty();
    component.form.get('prop').markAsTouched();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.get('prop').dirty).toBe(true);
    expect(component.form.get('prop').touched).toBe(true);
    expect(parse('.errorProp3')).toBe(true);
    expect(parse('.errorProp4')).toBe(true);
    expect(element.nativeElement.classList.contains('requiredVisibleAtRuntime')).toBe(false);
    component.form.patchValue({ prop: '' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(element.nativeElement.classList.contains('requiredVisibleWhenDirty')).toBe(true);
    expect(element.nativeElement.classList.contains('requiredVisibleWhenDirtyTouched')).toBe(true);
    expect(parse('.errorProp3')).toBe(false);
    expect(parse('.errorProp4')).toBe(false);

    component.form.patchValue({ prop: 'ngx' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(element.nativeElement.classList.contains('requiredVisibleAtRuntime')).toBe(false);
    expect(element.nativeElement.classList.contains('requiredVisibleWhenDirty')).toBe(false);
    expect(element.nativeElement.classList.contains('requiredVisibleWhenDirtyTouched')).toBe(false);
    expect(element.nativeElement.classList.contains('visibleAnyErrorDirtyTouched')).toBe(true);
    expect(component.form.get('prop').hasError('required')).toBe(false);
    expect(component.form.get('prop').hasError('minlength')).toBe(true);
    expect(component.form.get('prop').hasError('maxlength')).toBe(false);
    expect(el.query(By.css('.errorMinLength')).nativeElement.textContent).toContain('5 characters minimum');
    expect(parse('.errorProp3')).toBe(false);
    expect(parse('.errorProp4')).toBe(true);

    component.form.patchValue({ prop: 'ngxErrors!!!!!' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(element.nativeElement.classList.contains('requiredVisibleAtRuntime')).toBe(false);
    expect(element.nativeElement.classList.contains('requiredVisibleWhenDirty')).toBe(false);
    expect(element.nativeElement.classList.contains('requiredVisibleWhenDirtyTouched')).toBe(false);
    expect(element.nativeElement.classList.contains('visibleAnyErrorDirtyTouched')).toBe(true);
    expect(component.form.get('prop').hasError('required')).toBe(false);
    expect(component.form.get('prop').hasError('minlength')).toBe(false);
    expect(component.form.get('prop').hasError('maxlength')).toBe(true);
    expect(el.query(By.css('.errorMinLength')).nativeElement.textContent).toContain('10 characters maximum');

    expect(parse('.errorProp1').maxlength.requiredLength).toBe(10);
    expect(parse('.errorProp1').maxlength.actualLength).toBe(14);
    expect(parse('.errorProp2')).toBe(true);
    expect(parse('.errorProp3')).toBe(false);
    expect(parse('.errorProp4')).toBe(true);

    done();

  });

});
