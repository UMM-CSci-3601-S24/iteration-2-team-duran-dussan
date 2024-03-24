import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HunterViewComponent } from './hunter-view.component';

describe('HunterViewComponent', () => {
  let component: HunterViewComponent;
  let fixture: ComponentFixture<HunterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HunterViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HunterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
