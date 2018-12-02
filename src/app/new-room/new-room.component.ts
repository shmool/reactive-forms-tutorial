import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DbService } from '../db.service';
import { Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

const INIT_ROWS = 10;
const INIT_SEATS = 20;

interface FormValue {
  firstName: string;
};


@Component({
  selector: 'app-new-room',
  template: `
    <h1>New Room</h1>

    <form [formGroup]="roomConfig" clrForm (ngSubmit)="save()" autocomplete="off">

      <clr-input-container>
        <label>Room name: </label>
        <input clrInput formControlName="roomName">
        <clr-control-error>Required</clr-control-error>
      </clr-input-container>

      <clr-input-container>
        <label>Number of rows:</label>
        <input clrInput type="number" formControlName="rowCount">
        <clr-control-error>Must be 1 or more</clr-control-error>
      </clr-input-container>

      <clr-input-container>
        <label>Average number of seats per row:</label>
        <input clrInput type="number" formControlName="avgSeatsInRow">
        <clr-control-error>Must be 1 or more</clr-control-error>
      </clr-input-container>


      <button type="submit" class="btn btn-primary btn-icon" [disabled]="!roomConfig.valid">
        <clr-icon shape="check"></clr-icon>
        Save Room
      </button>

    </form>

    <form [formGroup]="form" clrForm autocomplete="off">
      <label>First name</label><input formControlName="firstName">

      <div formArrayName="arr">
        <div *ngFor="let item of form.get('arr').controls; let i = index">
          <input [formControlName]="i">
        </div>
      </div>
    </form>
  `,
  styleUrls: ['./new-room.component.scss']
})
export class NewRoomComponent implements OnInit {
  roomConfig;
  form;

  constructor(private db: DbService, private router: Router) {

    this.roomConfig = new FormGroup({
      id: new FormControl(),
      roomName: new FormControl('', Validators.required),
      rowCount: new FormControl(INIT_ROWS, [Validators.required, Validators.min(1)]),
      avgSeatsInRow: new FormControl(INIT_SEATS, [Validators.required, Validators.min(1)])
    });

    this.form = new FormGroup({
        firstName: new FormControl('', Validators.required),
      arr: new FormArray([
        new FormControl(),
        new FormControl(),
        new FormControl()
      ])
      }
    );

    this.form.patchValue({arr: [1,2,3,4]});

    console.log(this.form)

  }

  ngOnInit() {

    this.form.valueChanges.pipe(
      map((value: FormValue) => {
        if (value.firstName === '?') {
          value.firstName = '';
        } else {
          value.firstName = value.firstName.toUpperCase();
        }
        console.log(value)
        this.form.updateValueAndValidity();
        return value;
      }),
      // distinctUntilChanged(),
      filter((value) => this.form.valid))
      .subscribe((value) => {
        console.log("Model Driven Form valid value: vm = ",
          JSON.stringify(value));
      });
  }

  save() {
    this.db.saveRoomConfig(this.roomConfig.value)
      .then(id => {
        console.log('room saved, id:', id);
        this.router.navigate(['/room-config', id]);
      });

  }
}
