import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KahootInitialComponent } from './kahoot-initial.component';

describe('KahootInitialComponent', () => {
  let component: KahootInitialComponent;
  let fixture: ComponentFixture<KahootInitialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KahootInitialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KahootInitialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
