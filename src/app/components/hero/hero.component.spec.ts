import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { HeroComponent } from './hero.component';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    localStorage.removeItem('lang');
    await TestBed.configureTestingModule({
      imports: [HeroComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the hero title from translation data', () => {
    const h1 = fixture.debugElement.query(By.css('h1'));
    expect(h1.nativeElement.textContent).toContain(component.data().hero.titleLine1);
  });

  it('should keep the resume modal closed initially', () => {
    expect(component.isResumeModalOpen()).toBe(false);
  });

  it('should open the resume modal', () => {
    component.openResumeModal();
    expect(component.isResumeModalOpen()).toBe(true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[role="dialog"], .fixed'))).toBeTruthy();
  });

  it('should close the resume modal', () => {
    component.openResumeModal();
    component.closeResumeModal();
    expect(component.isResumeModalOpen()).toBe(false);
    fixture.detectChanges();
  });

  it('should open and close the modal through the template buttons', () => {
    const openButton = fixture.debugElement.queryAll(By.css('button')).find(b =>
      b.nativeElement.textContent.includes(component.data().hero.resumeCta)
    );
    openButton?.nativeElement.click();
    fixture.detectChanges();
    expect(component.isResumeModalOpen()).toBe(true);

    const closeButton = fixture.debugElement.queryAll(By.css('button')).find(b =>
      b.nativeElement.getAttribute('aria-label') === component.data().hero.resumeModal.closeAria
    );
    closeButton?.nativeElement.click();
    fixture.detectChanges();
    expect(component.isResumeModalOpen()).toBe(false);
  });

  it('should close the modal when pressing Escape', () => {
    component.openResumeModal();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(component.isResumeModalOpen()).toBe(false);
  });

  it('should render CV download links inside the modal', () => {
    component.openResumeModal();
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('a[download]'));
    expect(links.length).toBe(2);
    expect(links[0].nativeElement.getAttribute('href')).toBe('assets/docs/manuel_alba_cv_en.pdf');
    expect(links[1].nativeElement.getAttribute('href')).toBe('assets/docs/manuel_alba_cv_es.pdf');
  });
});

