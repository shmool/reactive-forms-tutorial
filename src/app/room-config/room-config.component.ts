import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { DbService } from '../db.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

/***
 * todo in template:
 * 1. connect form to form arrays, groups, and controls
 * 2. bind to inputs of app-seat-control
 */

@Component({
  selector: 'app-room-config',
  template: `
    <h2>{{ config ? config.roomName : 'Loading room ' + roomId }}</h2>

    <form *ngIf="roomConfigForm"
          [formGroup]="roomConfigForm"
          class="room-config-form"
          (ngSubmit)="save()">

      <button type="submit" class="btn btn-success">
        <clr-icon shape="check"></clr-icon>
        Save
      </button>

      <div class="room-config">
        <div *ngFor="let row of rows; let i = index"
             class="seating-rows-config row">
          <div class="col-sm-1">
            <input type="number">
          </div>

          <div class="col-sm-1 row-number">
            <span>{{ i + 1 }}</span>
          </div>

          <div class="col-sm-8 row-seats">
            <app-seat-control *ngFor="let seat of seats"></app-seat-control>
          </div>

          <div class="col-sm-2">
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
  // todo: this is a placeholder for initial view
  rows = Array.from({ length: 20 });
  seats = Array.from({ length: 15 });

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
            // todo: set the value of the form to the saved configuration
          }
        });
    });
  }

  createRoomConfigForm() {
    // todo: create form group with {rows: row[]} (form array)
    // todo: row = form group with {seatCount: number, seats: seatType[]}
    // todo: default value of seatType is this.seatTypes[0].id
    this.roomConfigForm = new FormGroup({});
  }

  changeSeatCount(control, val) {
    const seatsControl = <FormArray>control.parent.get('seats');
    const gap = val - seatsControl.length;
    const repeater = Array(Math.abs(gap)).fill(null);
    if (gap > 0) {
      repeater.forEach(_ => {
        // todo: push a seatType control with the default value
      });
    } else if (gap < 0) {
      const result = confirm(`Remove ${-gap} seats?`);
      if (result) {
        // todo: delete seats from val to the end
        repeater.forEach(_ => {
        });
      }
    }
  }

  save() {
    this.db.saveRoomConfig({ ...this.config, room: this.roomConfigForm.value });
  }

  duplicateRow(row, rowNumber) {
    // todo: insert a row with the same value and configuration as the argument right before/after
  }

  deleteRow(rowNumber) {
    // todo: remove a row
  }
}
