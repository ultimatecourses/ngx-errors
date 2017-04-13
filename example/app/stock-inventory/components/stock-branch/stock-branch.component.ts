import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'stock-branch',
  styleUrls: ['stock-branch.component.scss'],
  template: `
    <div [formGroup]="parent">
      <div formGroupName="store">
        
        <div>
          <input type="text" placeholder="Branch ID" formControlName="branch">
        </div>

        <div ngxErrors="store.branch">
          <div class="error" ngxError="required" [when]="['dirty', 'touched']">
            Branch ID is required
          </div>
          <div class="error" ngxError="invalidBranch" when="dirty">
            Invalid branch code: 1 letter, 3 numbers
          </div>
          <div class="error" ngxError="unknownBranch" when="dirty">
            Unknown branch, please check the ID
          </div>
        </div>

        <div>
          Danger: {{ myError.hasError('*', ['touched']) | json }}
          Success: {{ !myError.hasError('*', ['touched']) | json }}
        </div>
        
        <input 
          type="text" 
          placeholder="Manager Code" 
          formControlName="code"
          [class.required]="myError.hasError('required', ['dirty', 'touched'])">

        <div ngxErrors="store.code" #myError="ngxErrors">
          <div class="error" ngxError="required" [when]="['touched']">
            Field is required
          </div>
          <div class="error" ngxError="minlength" [when]="['touched']">
            Min-length is {{ myError.getError('minlength')?.requiredLength }}
          </div>
          <div class="error" ngxError="maxlength" [when]="['dirty', 'touched']">
            Max-length is {{ myError.getError('maxlength')?.requiredLength }}
          </div>
        </div>

      </div>
    </div>
  `
})
export class StockBranchComponent {
  @Input()
  parent: FormGroup;
}