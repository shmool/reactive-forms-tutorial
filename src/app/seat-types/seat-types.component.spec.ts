import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatTypesComponent } from './seat-types.component';

describe('SeatTypesComponent', () => {
  let component: SeatTypesComponent;
  let fixture: ComponentFixture<SeatTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeatTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeatTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
