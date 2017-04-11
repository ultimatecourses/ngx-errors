import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'stock-branch',
  styleUrls: ['stock-branch.component.scss'],
  template: `
    <div [formGroup]="parent">
      <div formGroupName="store">
        
        <input type="text" placeholder="Branch ID" formControlName="branch">

        <div ngErrors="store.branch">
          <div class="error" ngError="required" [when]="['dirty', 'touched']">
            Branch ID is required
          </div>
          <div class="error" ngError="invalidBranch" when="dirty">
            Invalid branch code: 1 letter, 3 numbers
          </div>
          <div class="error" ngError="unknownBranch" when="dirty">
            Unknown branch, please check the ID
          </div>
        </div>
        
        <input type="text" placeholder="Manager Code" formControlName="code">

        <div ngErrors="store.code">
          <div class="error" ngError="required" [when]="['touched']">
            Manager ID is required
          </div>
          <div class="error" [ngError]="['minlength', 'maxlength']" [when]="['dirty', 'touched']">
            Minlength is 2, max length is 5
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