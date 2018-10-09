import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeatTypesComponent } from './seat-types/seat-types.component';
import { NewRoomComponent } from './new-room/new-room.component';
import { RoomConfigComponent } from './room-config/room-config.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'new-room', component: NewRoomComponent },
  { path: 'room-config/:id', component: RoomConfigComponent },
  { path: 'seat-types', component: SeatTypesComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
