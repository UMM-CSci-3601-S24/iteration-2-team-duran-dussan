import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinHuntComponent } from './join-hunt.component';

describe('JoinHuntComponent', () => {
  let component: JoinHuntComponent;
  let fixture: ComponentFixture<JoinHuntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinHuntComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JoinHuntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
