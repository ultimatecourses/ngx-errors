[![Build Status][circle-badge]][circle-badge-url]
[![Dependency Status][david-badge]][david-badge-url]
[![devDependency Status][david-dev-badge]][david-dev-badge-url]
[![npm][npm-badge]][npm-badge-url]

<h1 align="center">
<img width="40" valign="bottom" src="https://angular.io/assets/images/logos/angular/angular.svg">
ngx-errors
</h1>
<h4 align="center">A declarative validation errors module for reactive forms.</h4>

---

<a href="https://ultimateangular.com" target="_blank"><img src="https://ultimateangular.com/assets/img/banner.jpg"></a>

---

<div align="center" markdown="1">
<a href="#installation">Installation</a> |
<a href="#setup">Setup</a> |
<a href="#documentation">Documentation</a> |
<a href="http://plnkr.co/edit/JS0jSnelnLY9IbzFySfl?p=preview">Live demo</a>
</div>

---

# Overview

Why use ngx-errors, how to install and use.

### What is it?

Declarative validation error messages for reactive forms.

Typically you'd do something like this:

```js
<!-- without ngxErrors -->
<input type="text" formControlName="foo">

<div *ngIf="form.get('foo').hasError('required') && form.get('foo').touched">
  Field is required
</div>
<div *ngIf="form.get('foo').hasError('minlength') && form.get('foo').dirty">
  Min length is 5
</div>
```

With ngxErrors, we've taken a simple declarative approach that cleans up your templates to make validation easier:

```js
<!-- with ngxErrors -->
<input type="text" formControlName="foo">

<div ngxErrors="foo">
  <div ngxError="required" when="touched">
    Field is required
  </div>
  <div ngxError="minlength" when="dirty">
    Min length is 5
  </div>
</div>
```

Check out the documentation below for all the syntax we provide.

### Installation

```bash
yarn add @ultimate/ngxerrors

# OR

npm i @ultimate/ngxerrors
```

### Setup

Just add ngx-errors to your module:

```js
import { NgxErrorsModule } from '@ultimate/ngxerrors';

@NgModule({ imports: [ NgxErrorsModule ] })
```

# Documentation

### ngxErrors

The `ngxErrors` directive works by dynamically fetching your FormControl under-the-hood, so simply take your `formControlName` value and pass it into `ngxErrors`:

```html
<input type="text" formControlName="username">
<div ngxErrors="username">
  // ...
</div>
```

This needs to be on a parent container that will encapsulate child `ngxError` directives.

### ngxError

The `ngxError` directive takes either a `string` or `array` as arguments. The argument you pass in corresponds to any active errors exposed on your control, such as "required" or "minlength":

```html
<input type="text" formControlName="username">
<div ngxErrors="username">
  <div ngxError="minlength">
    Min length is 5
  </div>
</div>
```

> Note: when using array syntax, `[]` bindings are needed

Using the array syntax, when any condition in the array is true the error will be shown:

```html
<input type="text" formControlName="username">
<div ngxErrors="username">
  <div [ngxError]="['minlength', 'maxlength']">
    Min length is 5, max length is 10
  </div>
</div>
```

### ngxError #when

The `when` directive takes either a `string` or `array` as arguments. It allows you to specify when you wish to display the error based on the control state, such as "dirty" or "touched":

```html
<input type="text" formControlName="username">
<div ngxErrors="username">
  <div ngxError="minlength" when="dirty">
    Min length is 5
  </div>
</div>
```

It also comes in array format for multiple rules:

```html
<input type="text" formControlName="username">
<div ngxErrors="username">
  <div ngxError="minlength" [when]="['dirty', 'touched']">
    Min length is 5
  </div>
</div>
```

### Dynamic errors

You can optionally data-bind and dynamically create validation errors with ngxErrors:

```html
<input type="text" formControlName="username">
<div ngxErrors="person.username">
  <div *ngFor="let error of errors" [ngxError]="error.name" [when]="error.rules">
    {{ error.text }}
  </div>
</div>
```

With corresponding component class:

```js
@Component({...})
export class MyComponent {
  errors = [
    { name: 'required', text: 'This field is required', rules: ['touched', 'dirty'] },
    { name: 'minlength', text: 'Min length is 5', rules: ['dirty'] }
  ];
}
```

### Nested FormGroup support

ngxErrors also supports FormGroups with control names using dot notation:

```html
<div formGroupName="person">
  <input type="text" formControlName="username">
  <div ngxErrors="person.username">
    <div ngxError="minlength" [when]="['dirty', 'touched']">
      Min length is 5
    </div>
  </div>
</div>
```

### Exported Directive API

ngx-errors exports itself as `ngxErrors`, which means you can access information about your control error states elsewhere in your template using a template reference, such as `#foo`.

Basic usage:

```html
<div ngxErrors="username" #myError="ngxErrors"></div>
```

#### getError(name: string): any;

The `getError` method returns the object associated with your error. This can be useful for dynamically displaying error rules.

> Example: Adds `Min length is 5` when value is less than 5 characters (based on `Validators.minLength(5)`).

```html
<input type="text" formControlName="username">

<div ngxErrors="username" #myError="ngxErrors">
  <div ngxError="minlength" when="dirty">
    Min length should be {{ myError.getError('minlength')?.requiredLength }}
  </div>
</div>
```

> The error returned is identical to Angular's FormControl API

#### hasError(name: string, conditions?: string | string[]): boolean;

The `hasError` method informs you if your control has the given error. This can be useful for styling elsewhere in your template based off the control's error state.

> Example: Adds `class="required"` when "myError" has the `required` error.

```html
<div [class.required]="myError.hasError('required')">
  <input type="text" formControlName="username">
</div>

<div ngxErrors="username" #myError="ngxErrors">
  <div ngxError="required" when="dirty">
    Field is required
  </div>
</div>
```

You can optionally pass in conditions in which to activate the error.

> Example: Adds `class="required"` when "myError" has the `required` error _and_ the states are `'dirty'` and `'touched'`.

```html
<div [class.required]="myError.hasError('required', ['dirty', 'touched'])">
  <input type="text" formControlName="username">
</div>

<div ngxErrors="username" #myError="ngxErrors">
  <div ngxError="required" when="dirty">
    Field is required
  </div>
</div>
```

You can also use the "catch-all" selector to get the state of your entire control's validity, alongside on an optional state collection.

```html
<div>
  <div [ngClass]="{
    invalid: myError.hasError('*'),
    invalidTouchedDirty: myError.hasError('*', ['touched', 'dirty'])
  }">
  </div>
  <input type="text" formControlName="username">
</div>

<div ngxErrors="username" #myError="ngxErrors">
  <div ngxError="required" when="dirty">
    Field is required
  </div>
</div>
```

#### isValid(name: string, conditions?: string | string[]): boolean;

The `isValid` method informs you if a your control is valid, or a property is valid. This can be useful for styling elsewhere in your template based off the control's validity state.

> Example: Adds `class="valid"` when "myError" has no `required` error.

```html
<div [class.valid]="myError.isValid('required')">
  <input type="text" formControlName="username">
</div>

<div ngxErrors="username" #myError="ngxErrors">
  <div ngxError="required" when="dirty">
    Field is required
  </div>
</div>
```

You can optionally pass in conditions in which to evaluate alongside the property you're checking is valid.

> Example: Adds `class="valid"` when "myError" has no `required` error _and_ the states are `'dirty'` and `'touched'`.

```html
<div [class.valid]="myError.isValid('required', ['dirty', 'touched'])">
  <input type="text" formControlName="username">
</div>

<div ngxErrors="username" #myError="ngxErrors">
  <div ngxError="required" when="dirty">
    Field is required
  </div>
</div>
```

You can also use the "catch-all" selector to check if the control is valid, with no specific error properties, alongside on an optional state collection.

```html
<div>
  <div [ngClass]="{
    valid: myError.isValid('*'),
    validTouchedDirty: myError.isValid('*', ['touched', 'dirty'])
  }">
  </div>
  <input type="text" formControlName="username">
</div>

<div ngxErrors="username" #myError="ngxErrors">
  <div ngxError="required" when="dirty">
    Field is required
  </div>
</div>
```

#### hasErrors: boolean;

The `hasErrors` property returns `true` if your control has any number of errors. This can be useful for styling elsewhere in your template on a global control level rather than individual errors.

> Example: Adds `class="errors"` when "myError" has any errors.

```html
<div [class.errors]="myError.hasErrors">
  <input type="text" formControlName="username">
</div>

<div ngxErrors="username" #myError="ngxErrors">
  <div ngxError="required" when="dirty">
    Field is required
  </div>
  <div ngxError="minlength" when="dirty">
    Min length is 5
  </div>
</div>
```

#### errors: { [key: string]: any; };

The `errors` property returns the object associated with any active errors. This can be used to access any error properties on your control.

> Example: Adds `Max length is 10, you typed (n)` when value is more than 10 characters (based on `Validators.maxLength(10)`).

```html
<input type="text" formControlName="username">

<div ngxErrors="username" #myError="ngxErrors">
  <div ngxError="minlength" when="dirty">...</div>
  <div ngxError="maxlength" when="dirty">...</div>
</div>

<div *ngIf="myError.errors?.maxlength">
  Max length is 10, you typed {{ myError.errors.maxlength.actualLength }}
</div>
```

> The errors returned are identical to Angular's FormControl API

[circle-badge]: https://circleci.com/gh/UltimateAngular/ngxerrors.svg?style=shield
[circle-badge-url]: https://circleci.com/gh/UltimateAngular/ngxerrors
[david-badge]: https://david-dm.org/UltimateAngular/ngxerrors.svg
[david-badge-url]: https://david-dm.org/UltimateAngular/ngxerrors
[david-dev-badge]: https://david-dm.org/UltimateAngular/ngxerrors/dev-status.svg
[david-dev-badge-url]: https://david-dm.org/UltimateAngular/ngxerrors?type=dev
[npm-badge]: https://img.shields.io/npm/v/@ultimate/ngxerrors.svg
[npm-badge-url]: https://www.npmjs.com/package/@ultimate/ngxerrors

# Contributing

Please see the [contributing](CONTRIBUTING.md) guidelines.
