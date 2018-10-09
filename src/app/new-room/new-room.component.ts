import { Component, OnInit } from '@angular/core';
import { DbService } from '../db.service';
import { Router } from '@angular/router';

const INIT_ROWS = 10;
const INIT_SEATS = 20;

/***
 * Todo - in template:
 * 1. use form elements
 * 2. use Clarity components and directives
 * 3. bind the form, form controls, and submit event
 * 4. add validation errors and disable submit button when not valid
 */

@Component({
  selector: 'app-new-room',
  template: `
    <h1>New Room</h1>

    <div>

      <div>
        <label>Room name: </label>
        <input>
      </div>

      <div>
        <label>Number of rows:</label>
        <input>
      </div>

      <div>
        <label>Average number of seats per row:</label>
        <input>
      </div>

      <button type="submit" class="btn btn-primary btn-icon">
        <clr-icon shape="check"></clr-icon>
        Save Room
      </button>

    </div>
  `,
  styleUrls: ['./new-room.component.scss']
})
export class NewRoomComponent implements OnInit {
  roomConfig;

  constructor(private db: DbService, private router: Router) {

    // todo: assign a form group with configuration to this.roomConfig
    this.roomConfig = null;

  }

  ngOnInit() {
  }

  save() {
    // todo: validate and pass the form value
    this.db.saveRoomConfig(null)
      .then(id => {
        console.log('room saved, id:', id);
        this.router.navigate(['/room-config', id]);
      });
  }
}
