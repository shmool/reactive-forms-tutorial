import { Injectable } from '@angular/core';
import Dexie from 'dexie';

export interface RoomConfig {
  id?: number;
  roomName: string;
  rowCount: number;
  avgSeatsInRow: number;
}

export interface SeatType {
  id?: number;
  name?: string;
  color?: string;
  price?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DbService extends Dexie {
  roomConfigs: Dexie.Table<RoomConfig, number>;
  seatTypes: Dexie.Table<SeatType, number>;

  constructor() {

    super('RoomsDemo');

    this.version(5).stores({
      roomConfigs: '++id, name',
      seatTypes: '++id, name'
    });

    this.on('populate', () => {
      this.seatTypes.add({id: 1, name: 'regular', price: null, color: '#666666'});
    });
  }

  saveRoomConfig(config) {
    if (!config.id) { // id === null, need to remove so dexie will generate id
      delete config.id;
    } // else - updating an existing config
      return this.roomConfigs.put(config);
  }

  getRoomConfig(index) {
    return index ? this.roomConfigs.get(+index) : Promise.resolve(null);
  }

  getRoomConfigs() {
    return this.roomConfigs.toArray();
  }

  getSeatTypes() {
    return this.seatTypes.toArray();
  }


  updateSeatTypes(types) {
    this.seatTypes.clear();
    types.forEach(type => {
      if (type.id) {
        this.seatTypes.put(type);
      } else {
        delete type.id;
        this.seatTypes.add(type);
      }
    });
  }

}
