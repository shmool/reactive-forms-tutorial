import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <a href="http://ng-girls.org" target="_blank">
      <img class="logo" src="http://ng-girls.org/img/other/logo_big.png">
    </a>
    <h1>Reactive Forms Tutorial</h1>
    <h2>by Shmuela Jacobs</h2>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
