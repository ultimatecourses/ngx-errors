[![Build Status][circle-badge]][circle-badge-url]
[![Dependency Status][david-badge]][david-badge-url]
[![devDependency Status][david-dev-badge]][david-dev-badge-url]
[![npm][npm-badge]][npm-badge-url]

<h1 align="center">
<img width="40" valign="bottom" src="https://angular.io/resources/images/logos/angular/angular.svg">
ngxErrors
</h1>
<h4 align="center">A declarative validation module for reactive forms.</h4>

---

<a href="https://ultimateangular.com" target="_blank"><img src="https://ultimateangular.com/assets/img/banner.jpg"></a>

---

<div align="center" markdown="1">
<a href="#installation">Installation</a> |
<a href="#setup">Setup</a> |
<a href="#documentation">Documentation</a> |
<a href="http://plnkr.co/edit/JS0jSnelnLY9IbzFySfl">Live demo</a>
</div>

---

# Overview

Why use ngxErrors, how to install and include.

### What is it?

Form validation error reporting made easy for reactive forms. Typically you'd do something like this:

```js
<input type="text" formControlName="foo">
<div *ngIf="form.get('foo').hasError('required') && form.get('foo').touched">
  Field is required
</div>
<div *ngIf="form.get('foo').hasError('minlength') && form.get('foo').dirty">
  Min length is 5
</div>
```

With ngxErrors, we've taken a simple declarative approach that cleans up your templates:

```js
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

Just add ngxErrors to your module:

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
