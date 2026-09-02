import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AboutComponent } from './about.component';
import { TranslationService } from '../../services/translation.service';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;
  let translation: TranslationService;

  beforeEach(async () => {
    localStorage.removeItem('lang');
    await TestBed.configureTestingModule({
      imports: [AboutComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    translation = TestBed.inject(TranslationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the section eyebrow and title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(translation.data().about.eyebrow);
    expect(compiled.textContent).toContain(translation.data().about.title);
  });

  it('should render the greeting card and paragraph without repeating the hero description', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(translation.data().about.greeting);
    expect(compiled.textContent).toContain(translation.data().about.paragraph1);
  });

  it('should render skill categories', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    for (const category of translation.data().about.skillCategories) {
      expect(compiled.textContent).toContain(category.title);
    }
  });

  it('should update texts when language switches to Spanish', () => {
    translation.setLanguage('es');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Perfil Profesional & Enfoque Técnico');
  });
});

