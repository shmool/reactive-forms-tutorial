import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SeatType } from '../db.service';

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
              (blur)="onTouched()"
              clrDropdownTrigger
              [style.backgroundColor]="selectedType?.color">
        <span>{{ seatId + 1 }}</span>
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
export class SeatControlComponent implements ControlValueAccessor {
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

  onChange = _ => {};

  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  setType(type) {
    this.value = type.id;
    this.onChange(type.id);
    this.onTouched();
  }

}
