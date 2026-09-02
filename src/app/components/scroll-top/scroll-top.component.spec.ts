import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollTopComponent } from './scroll-top.component';

describe('ScrollTopComponent', () => {
  let component: ScrollTopComponent;
  let fixture: ComponentFixture<ScrollTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollTopComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be hidden when scroll position is below the threshold', () => {
    Object.defineProperty(window, 'scrollY', { value: 100, configurable: true });
    component.onWindowScroll();
    expect(component.isVisible()).toBe(false);
  });

  it('should be visible when scroll position exceeds the threshold', () => {
    Object.defineProperty(window, 'scrollY', { value: 500, configurable: true });
    component.onWindowScroll();
    expect(component.isVisible()).toBe(true);
  });

  it('should scroll to top', () => {
    const scrollTo = jest.spyOn(window, 'scrollTo');
    component.scrollToTop();
    expect(scrollTo.mock.calls[0][0]).toEqual({ top: 0, behavior: 'smooth' });
  });
});
