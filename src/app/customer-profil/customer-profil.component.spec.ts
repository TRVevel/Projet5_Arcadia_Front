import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProfilComponent } from './customer-profil.component';

describe('CustomerProfilComponent', () => {
  let component: CustomerProfilComponent;
  let fixture: ComponentFixture<CustomerProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerProfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
