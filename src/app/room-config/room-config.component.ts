import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DbService } from '../db.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/internal/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-room-config',
  template: `
    <h2>{{ config ? config.roomName : 'Loading room ' + roomId }}</h2>

    <form *ngIf="roomConfigForm"
          [formGroup]="roomConfigForm"
          class="room-config-form clr-form clr-form-horizontal"
          (ngSubmit)="save()">

      <button type="submit" class="btn btn-success">
        <clr-icon shape="check"></clr-icon>
        Save
      </button>

      <div formArrayName="rows" class="room-config">
        <div *ngFor="let row of roomConfigForm.get('rows').controls; let i = index"
             [formGroupName]="i"
             class="seating-rows-config clr-row">
          <div class="clr-col-sm-1">
            <input type="number" formControlName="seatCount">
          </div>

          <div class="clr-col-sm-1 row-number">
            <span>{{ i + 1 }}</span>
          </div>

          <div formArrayName="seats" class="clr-col-sm-8 row-seats">
            <app-seat-control *ngFor="let seat of row.get(['seats']).controls; let j=index"
                              [seatId]="j"
                              [seatTypes]="seatTypes"
                              [formControlName]="j"></app-seat-control>
          </div>

          <div class="clr-col-sm-2">
            <button type="button"
                    class="btn btn-icon btn-sm btn-primary btn-row-action"
                    (click)="duplicateRow(row, i)">
              <clr-icon shape="copy"></clr-icon>
            </button>
            <button type="button"
                    class="btn btn-icon btn-sm btn-warning btn-row-action"
                    (click)="deleteRow(i)">
              <clr-icon shape="remove"></clr-icon>
            </button>
          </div>
        </div>
      </div>

    </form>
  `,
  styleUrls: ['./room-config.component.scss']
})
export class RoomConfigComponent implements OnInit {
  @Input() config;
  roomId;
  roomConfigForm;
  seatTypes;

  constructor(private db: DbService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    const seatTypesPromise = this.db.getSeatTypes()
      .then(types => this.seatTypes = types)
      .catch(console.error);

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.roomId = params.get('id');

      Promise.all([this.db.getRoomConfig(this.roomId), seatTypesPromise])
        .then(([config, types]) => {
          if (!config) {
            console.error(`room config of id ${this.roomId} was not found`);
            return;
          }
          this.config = config;

          if (!types) {
            console.error(`seat types were not found`);
            return;
          }

          this.createRoomConfigForm();
          if (this.config.room) {
            this.roomConfigForm.patchValue(this.config.room.rows);
          }
        });
    });
  }

  createRoomConfigForm() {
    this.roomConfigForm = new FormGroup({
      rows: new FormArray(Array.from(
        this.config.room ? this.config.room.rows : { length: this.config.rowCount },
        (rowConfig) => this.generateRow(rowConfig)
      ))
    });
  }

  generateRow(rowConfig) {
    const seatCount = rowConfig && rowConfig.seats ? rowConfig.seats.length : this.config.avgSeatsInRow;
    const row = new FormGroup({
      seatCount: this.generateSeatCountControl(seatCount),
      seats: new FormArray(Array.from(
        rowConfig && rowConfig.seats || { length: seatCount },
        (seatType, id) => {
          return new FormControl(seatType || this.seatTypes[0].id);
        }))
    });
    return row;
  }

  generateSeatCountControl(seatCount: number) {
    const control = new FormControl(seatCount);
    control.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(val => this.changeSeatCount(control, val));
    return control;
  }

  changeSeatCount(control, val) {
    const seatsControl = <FormArray>control.parent.get('seats');
    const gap = val - seatsControl.length;
    const repeater = Array(Math.abs(gap)).fill(null);
    if (gap > 0) {
      repeater.forEach(_ => {
        seatsControl.push(new FormControl(this.seatTypes[0].id));
      });
    } else if (gap < 0) {
      const result = confirm(`Remove ${-gap} seats?`);
      if (result) {
        repeater.forEach(_ => {
          seatsControl.removeAt(val);
        });
      }
    }
  }

  save() {
    this.db.saveRoomConfig({ ...this.config, room: this.roomConfigForm.value });
  }

  duplicateRow(row, rowNumber) {
    this.roomConfigForm.get('rows').insert(rowNumber, this.generateRow(row.value));
  }

  deleteRow(rowNumber) {
    this.roomConfigForm.get('rows').removeAt(rowNumber);
  }
}
