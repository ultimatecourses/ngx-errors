import { NgModule } from '@angular/core';

import { NgxErrorsDirective } from './ngxerrors.directive';
import { NgxErrorDirective } from './ngxerror.directive';

const dependencies = [
  NgxErrorsDirective,
  NgxErrorDirective
];

@NgModule({
  declarations: [...dependencies],
  exports: [...dependencies]
})
export class NgxErrorsModule {}