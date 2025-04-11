import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteCommandeComponent } from './carte-commande.component';

describe('CarteCommandeComponent', () => {
  let component: CarteCommandeComponent;
  let fixture: ComponentFixture<CarteCommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarteCommandeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarteCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
