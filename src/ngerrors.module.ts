import { NgModule } from '@angular/core';

import { NgErrorsDirective } from './ngerrors.directive';
import { NgErrorDirective } from './ngerror.directive';

const dependencies = [
  NgErrorsDirective,
  NgErrorDirective
];

@NgModule({
  declarations: [...dependencies],
  exports: [...dependencies]
})
export class NgErrorsModule {}