import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenRegComponent } from './token-reg.component';

describe('TokenRegComponent', () => {
  let component: TokenRegComponent;
  let fixture: ComponentFixture<TokenRegComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TokenRegComponent]
    });
    fixture = TestBed.createComponent(TokenRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
