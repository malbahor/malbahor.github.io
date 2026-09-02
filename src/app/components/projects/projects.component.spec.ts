import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsComponent } from './projects.component';
import { TranslationService } from '../../services/translation.service';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let translation: TranslationService;

  beforeEach(async () => {
    localStorage.removeItem('lang');
    await TestBed.configureTestingModule({
      imports: [ProjectsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    translation = TestBed.inject(TranslationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the section eyebrow and title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(translation.data().projects.eyebrow);
    expect(compiled.textContent).toContain(translation.data().projects.title);
  });

  it('should render all project titles', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    for (const project of translation.data().projects.projects) {
      expect(compiled.textContent).toContain(project.title);
    }
  });
});

