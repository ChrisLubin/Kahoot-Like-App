import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedGameComponent } from './created-game.component';

describe('CreatedGameComponent', () => {
  let component: CreatedGameComponent;
  let fixture: ComponentFixture<CreatedGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatedGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatedGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
