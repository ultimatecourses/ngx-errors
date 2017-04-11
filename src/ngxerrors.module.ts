import { NgModule } from "@angular/core";

import { NgxErrorDirective } from "./ngxerror.directive";
import { NgxErrorsDirective } from "./ngxerrors.directive";

const dependencies = [
  NgxErrorsDirective,
  NgxErrorDirective,
];

@NgModule({
  declarations: [...dependencies],
  exports: [...dependencies],
})
export class NgxErrorsModule {}
