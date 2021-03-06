import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { ClarityModule, ClrFormsNextModule } from '@clr/angular';
import { HeaderComponent } from './header/header.component';
import { NewRoomComponent } from './new-room/new-room.component';
import { SeatTypesComponent } from './seat-types/seat-types.component';
import { RoomConfigComponent } from './room-config/room-config.component';
import { SeatControlComponent } from './seat-control/seat-control.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NewRoomComponent,
    SeatTypesComponent,
    RoomConfigComponent,
    SeatControlComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ClarityModule,
    ClrFormsNextModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
