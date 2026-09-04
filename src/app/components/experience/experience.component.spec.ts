import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceComponent } from './experience.component';
import { TranslationService } from '../../services/translation.service';

describe('ExperienceComponent', () => {
  let component: ExperienceComponent;
  let fixture: ComponentFixture<ExperienceComponent>;
  let translation: TranslationService;

  beforeEach(async () => {
    localStorage.removeItem('lang');
    await TestBed.configureTestingModule({
      imports: [ExperienceComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ExperienceComponent);
    component = fixture.componentInstance;
    translation = TestBed.inject(TranslationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the section eyebrow and title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(translation.data().experience.eyebrow);
    expect(compiled.textContent).toContain(translation.data().experience.title);
  });

  it('should render the current company badge and all experiences', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(translation.data().experience.currentBadge);
        for (const item of translation.data().experience.experiences) {
      expect(compiled.textContent).toContain(item.company);
    }
  });

  it('should render the description of every experience', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    for (const item of translation.data().experience.experiences) {
      expect(compiled.textContent).toContain(item.description);
    }
  });

  it('should render every achievement of every experience', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    for (const item of translation.data().experience.experiences) {
      for (const achievement of item.achievements) {
        expect(compiled.textContent).toContain(achievement);
      }
    }
  });

  it('should render every technology chip of every experience', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    for (const item of translation.data().experience.experiences) {
      for (const tech of item.technologies) {
        expect(compiled.textContent).toContain(tech);
      }
    }
  });

  it('should reflect the enriched NTT DATA responsibilities in the view', () => {
    localStorage.removeItem('lang');
    translation.setLanguage('es');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Angular 18');
    expect(compiled.textContent).toContain('Jenkins');
    expect(compiled.textContent).toContain('Postman');
  });
});

