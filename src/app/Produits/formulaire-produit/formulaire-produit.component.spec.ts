import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireProduitComponent } from './formulaire-produit.component';

describe('FormulaireProduitComponent', () => {
  let component: FormulaireProduitComponent;
  let fixture: ComponentFixture<FormulaireProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulaireProduitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaireProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
