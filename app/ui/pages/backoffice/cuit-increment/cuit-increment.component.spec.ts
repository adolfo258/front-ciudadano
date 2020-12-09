import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuitIncrementComponent } from './cuit-increment.component';

describe('CuitIncrementComponent', () => {
  let component: CuitIncrementComponent;
  let fixture: ComponentFixture<CuitIncrementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuitIncrementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuitIncrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
