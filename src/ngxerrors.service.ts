import { Injectable } from '@angular/core';
import { NgxOptions } from "./ngxerrors";


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
