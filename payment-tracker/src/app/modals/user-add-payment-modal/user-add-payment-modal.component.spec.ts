import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddPaymentModalComponent } from './user-add-payment-modal.component';

describe('UserAddPaymentModalComponent', () => {
  let component: UserAddPaymentModalComponent;
  let fixture: ComponentFixture<UserAddPaymentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAddPaymentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAddPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
