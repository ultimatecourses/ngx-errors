import { Injectable } from '@angular/core';
import { ErrorOptions } from './ngxerrors';


export interface NgxOptions {
  validators?: ErrorOptions
}

@Injectable()
export class NgxErrorsService {

  private options: NgxOptions;

  constructor(options: NgxOptions) {
    this.options = options;
  }

  getOptions() {
    return this.options;
  }
}
