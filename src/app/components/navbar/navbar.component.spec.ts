import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NavbarComponent } from './navbar.component';
import { TranslationService } from '../../services/translation.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let translation: TranslationService;

  beforeEach(async () => {
    localStorage.removeItem('lang');
    await TestBed.configureTestingModule({
      imports: [NavbarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    translation = TestBed.inject(TranslationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render nav items from translation data', () => {
    const links = fixture.debugElement.queryAll(By.css('nav a'));
    expect(links.length).toBe(translation.data().navbar.navItems.length);
  });

  it('should mark #home as active by default', () => {
    expect(component.isActive('#home')).toBe(true);
    expect(component.isActive('#about')).toBe(false);
  });

  it('should toggle the mobile menu', () => {
    expect(component.isMenuOpen()).toBe(false);
    component.toggleMenu();
    expect(component.isMenuOpen()).toBe(true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('[class*="md:hidden"]'))).toBeTruthy();
    component.toggleMenu();
    expect(component.isMenuOpen()).toBe(false);
  });

  it('should close the menu', () => {
    component.toggleMenu();
    component.closeMenu();
    expect(component.isMenuOpen()).toBe(false);
  });

  it('should scroll to section and close menu on nav click', () => {
    const scrollIntoView = jest.fn();
    jest.spyOn(document, 'getElementById').mockReturnValue({ offsetTop: 300, scrollIntoView } as unknown as HTMLElement);

    component.toggleMenu();
    const event = { preventDefault: jest.fn() } as unknown as MouseEvent;
    component.scrollToSection(event, '#about');

    expect(event.preventDefault).toHaveBeenCalled();
    expect(document.getElementById).toHaveBeenCalledWith('about');
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    expect(component.activeSection()).toBe('#about');
    expect(component.isMenuOpen()).toBe(false);
  });

  it('should ignore scroll navigation when section does not exist', () => {
    const scrollIntoView = jest.fn();
    jest.spyOn(document, 'getElementById').mockReturnValue(null);
    const event = { preventDefault: jest.fn() } as unknown as MouseEvent;
    component.scrollToSection(event, '#missing');
    expect(event.preventDefault).toHaveBeenCalled();
    expect(scrollIntoView).not.toHaveBeenCalled();
    expect(component.isMenuOpen()).toBe(false);
  });

  it('should set active section based on scroll position', () => {
    const sections: Record<string, { offsetTop: number }> = {
      home: { offsetTop: 0 },
      about: { offsetTop: 500 },
      experience: { offsetTop: 1000 },
      projects: { offsetTop: 1500 },
      contact: { offsetTop: 2000 }
    };
    jest.spyOn(document, 'getElementById').mockImplementation((id: string) => sections[id] as unknown as HTMLElement);

    Object.defineProperty(window, 'scrollY', { value: 600, configurable: true });
    component.onWindowScroll();
    expect(component.activeSection()).toBe('#about');

    Object.defineProperty(window, 'scrollY', { value: 1600, configurable: true });
    component.onWindowScroll();
    expect(component.activeSection()).toBe('#projects');

    Object.defineProperty(window, 'scrollY', { value: 50, configurable: true });
    component.onWindowScroll();
    expect(component.activeSection()).toBe('#home');
  });

  
  function flagButtons() {
    return fixture.debugElement.queryAll(By.css('button[type="button"]')).filter(b =>
      b.nativeElement.getAttribute('aria-label') === 'Switch to English' ||
      b.nativeElement.getAttribute('aria-label') === 'Cambiar a Español'
    );
  }

  function activeFlagLabels(): string[] {
    return flagButtons()
      .filter(b => b.nativeElement.classList.contains('active'))
      .map(b => b.nativeElement.getAttribute('aria-label'));
  }

  it('should mark only the English flag as active on initial load', () => {
    expect(translation.language()).toBe('en');
    const active = activeFlagLabels();
    expect(active.length).toBe(2);
    expect(active.every(label => label === 'Switch to English')).toBe(true);

    const enButtons = flagButtons().filter(b => b.nativeElement.getAttribute('aria-label') === 'Switch to English');
    const esButtons = flagButtons().filter(b => b.nativeElement.getAttribute('aria-label') === 'Cambiar a Español');
    expect(enButtons.length).toBe(2);
    expect(esButtons.length).toBe(2);
    enButtons.forEach(b => expect(b.nativeElement.classList).toContain('active'));
    esButtons.forEach(b => expect(b.nativeElement.classList).not.toContain('active'));
  });

  it('should move the active class to the Spanish flag after switching', () => {
    component.setLanguage('es');
    fixture.detectChanges();

    expect(translation.language()).toBe('es');
    const active = activeFlagLabels();
    expect(active.length).toBe(2);
    expect(active.every(label => label === 'Cambiar a Español')).toBe(true);

    const enButtons = flagButtons().filter(b => b.nativeElement.getAttribute('aria-label') === 'Switch to English');
    const esButtons = flagButtons().filter(b => b.nativeElement.getAttribute('aria-label') === 'Cambiar a Español');
    enButtons.forEach(b => expect(b.nativeElement.classList).not.toContain('active'));
    esButtons.forEach(b => expect(b.nativeElement.classList).toContain('active'));
  });

  it('should switch language to Spanish via the language buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button[type="button"]'));
    const esButton = buttons.find(b => b.nativeElement.getAttribute('aria-label') === 'Cambiar a Español');
    esButton?.nativeElement.click();
    expect(translation.language()).toBe('es');
  });

  it('should switch language to English via the language buttons', () => {
    translation.setLanguage('es');
    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css('button[type="button"]'));
    const enButton = buttons.find(b => b.nativeElement.getAttribute('aria-label') === 'Switch to English');
    enButton?.nativeElement.click();
    expect(translation.language()).toBe('en');
  });
});

