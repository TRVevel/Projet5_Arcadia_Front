import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePlatDetailsComponent } from './game-plat-details.component';

describe('GamePlatDetailsComponent', () => {
  let component: GamePlatDetailsComponent;
  let fixture: ComponentFixture<GamePlatDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamePlatDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamePlatDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
