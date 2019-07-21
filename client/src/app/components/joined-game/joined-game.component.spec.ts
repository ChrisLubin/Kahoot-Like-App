import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinedGameComponent } from './joined-game.component';

describe('JoinedGameComponent', () => {
  let component: JoinedGameComponent;
  let fixture: ComponentFixture<JoinedGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinedGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinedGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
