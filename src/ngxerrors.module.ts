import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';

import { NgxErrorsDirective } from './ngxerrors.directive';
import { NgxErrorDirective } from './ngxerror.directive';
import { NgxErrorsService } from './ngxerrors.service';

const dependencies = [
  NgxErrorsDirective,
  NgxErrorDirective
];

export const OPTIONS = new InjectionToken('Token ngxErrors/default-options');

export function _ngxErrorsFactory(options: any) {
  return new NgxErrorsService(options);
}

export function provideOptions(options: any): any[] {
  return [
    {provide: NgxErrorsService, useFactory: _ngxErrorsFactory, deps: [OPTIONS]},
    {provide: OPTIONS, useValue: options}
  ];
}

@NgModule({
  declarations: [...dependencies],
  exports: [...dependencies]
})
export class NgxErrorsModule {
  static forRoot(options): ModuleWithProviders {
    return {
      ngModule: NgxErrorsModule,
      providers: provideOptions(options)
    }
  }
}




