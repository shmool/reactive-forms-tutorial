import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SeatType } from '../db.service';

/***
 * todo in template:
 * bind to blur event to set the control state "touched"
 */

@Component({
  selector: 'app-seat-control',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SeatControlComponent),
    }
  ],
  template: `
    <clr-dropdown class="seat">
      <button type="button"
              clrDropdownTrigger
              [style.backgroundColor]="selectedType?.color">
        <span>{{ seatId ? seatId + 1 : 'x' }}</span>
      </button>

      <clr-dropdown-menu class="dropdown-menu">
        <button *ngFor="let type of _seatTypes"
                clrDropdownItem
                type="button"
                class="dropdown-item"
                (click)="setType(type)">
          <div class="seat-type-box" [style.backgroundColor]="type.color"></div>
          {{ type.name }}
        </button>
      </clr-dropdown-menu>

    </clr-dropdown>
  `,
  styleUrls: ['./seat-control.component.scss']
})
// todo: implement ControlValueAccessor
export class SeatControlComponent {
  @Input() seatId;

  @Input()
  set seatTypes(types) {
    this._seatTypes = types;
    if (this._value && this._seatTypes) {
      this.findSeatType();
    }
  }

  @Input()
  set value(seatTypeId) {
    this._value = seatTypeId;
    if (this._seatTypes) {
      this.findSeatType();
    }
  }

  @Input() disabled = false;

  selectedType: SeatType = {};
  _seatTypes;
  _value;

  private findSeatType() {
    this.selectedType = this._seatTypes.find(type => type.id === this._value);
  }

  setType(type) {
    this.value = type.id;
    // todo: notify changed and touched
  }

}
