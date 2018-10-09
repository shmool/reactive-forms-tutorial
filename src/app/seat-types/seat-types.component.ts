import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DbService, SeatType } from '../db.service';

const TYPE_COLORS = ['#666666', '#aa2222', '#00aaff', '#cccc00'];

/***
 * todo in template:
 * 1. connect to array and form controls
 * 2. check for array errors
 * 3. remove array item on click event
 */

@Component({
  selector: 'app-seat-types',
  template: `
    <h2>Seat types</h2>

    <form [formGroup]="seatTypesForm" clrForm clrLayout="horizontal" (ngSubmit)="update()">

      <button type="button" class="btn btn-icon btn-sm" (click)="addType()">
        <clr-icon shape="plus"></clr-icon>
        Add type
      </button>

      <div class="types-container row">

        <div class="card card-block col-xs-4">

          <button aria-label="Close" class="close" type="button">
            <clr-icon aria-hidden="true" shape="close"></clr-icon>
          </button>

          <div [ngClass]="{'clr-error': fcs === i && false}">
            <clr-input-container>
              <label>name </label>
              <input (focus)="fcs = i"/>
              <clr-control-error>Required</clr-control-error>

            </clr-input-container>
            <div *ngIf="fcs === i && false" class="clr-subtext">
              The name '{{ null }}' is not unique
            </div>
          </div>

          <clr-input-container>
            <label>color</label>
            <input type="color"/></clr-input-container>
          <clr-input-container class="number-input">
            <label>price</label>
            <input type="number"/></clr-input-container>
        </div>
      </div>

      <button type="submit" class="btn btn-primary btn-icon" [disabled]="!seatTypesForm.valid">
        <clr-icon shape="check"></clr-icon>
        Update Types
      </button>

      <div *ngIf="false"
           class="clr-error">
        <clr-icon class="clr-validate-icon" shape="exclamation-circle"></clr-icon>
        <span class="clr-subtext form-error">All the names must be unique</span>
      </div>
    </form>
  `,
  styleUrls: ['./seat-types.component.scss']
})
export class SeatTypesComponent implements OnInit {
  seatTypesForm;
  types;
  fcs;

  constructor(private db: DbService) {
    // todo: assign a form array with configuration to this.types
    this.types = []; // this shouldn't be a simple array
    // todo: assign the types to the main form group
    this.seatTypesForm = new FormGroup({});
  }

  ngOnInit() {
    this.db.getSeatTypes().then(types => {
      if (types) {
        types.forEach(type => {
          this.addType(type);
        });
      } else {
        this.addType({ name: 'regular' });
      }
    });
  }

  addType(type?: SeatType) {
    type = type || {};
    const last = this.types.value ? this.types.value[this.types.value.length - 1] : null;
    const lastColorIndex = last ? TYPE_COLORS.findIndex(color => color === last.color) : -1;
    const newColor = type.color || TYPE_COLORS[lastColorIndex + 1 % TYPE_COLORS.length];

    // todo: push a new form group to this.types, with: {id, name, price, color}
  }

  removeType(index) {
    // todo: remove item from types form array
  }

  update() {
    this.db.updateSeatTypes(this.types.value);
  }

}
