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

  afterEach(() => {
    jest.restoreAllMocks();
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
    const layout: Record<string, { top: number; height: number }> = {
      home: { top: 0, height: 1100 },
      about: { top: 1100, height: 500 },
      experience: { top: 1600, height: 500 },
      projects: { top: 2100, height: 500 },
      contact: { top: 2600, height: 500 }
    };
    jest.spyOn(document, 'getElementById').mockImplementation(
      (id: string) => ({
        getBoundingClientRect: () => {
          const { top, height } = layout[id];
          return { top: top - window.scrollY, bottom: top + height - window.scrollY };
        }
      }) as unknown as HTMLElement
    );
    Object.defineProperty(window, 'innerHeight', { value: 1000, configurable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 20000, configurable: true });
    Object.defineProperty(document.body, 'scrollHeight', { value: 20000, configurable: true });

    Object.defineProperty(window, 'scrollY', { value: 1000, configurable: true });
    component.onWindowScroll();
    expect(component.activeSection()).toBe('#about');

    Object.defineProperty(window, 'scrollY', { value: 2000, configurable: true });
    component.onWindowScroll();
    expect(component.activeSection()).toBe('#projects');

    Object.defineProperty(window, 'scrollY', { value: 50, configurable: true });
    component.onWindowScroll();
    expect(component.activeSection()).toBe('#home');

    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 0, configurable: true });
    Object.defineProperty(document.body, 'scrollHeight', { value: 0, configurable: true });
  });

  it('should mark contact as active when scrolled to the bottom of the page', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 3000, configurable: true });
    Object.defineProperty(document.body, 'scrollHeight', { value: 3000, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
    Object.defineProperty(window, 'scrollY', { value: 2400, configurable: true });

    component.onWindowScroll();
    expect(component.activeSection()).toBe('#contact');

    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 0, configurable: true });
    Object.defineProperty(document.body, 'scrollHeight', { value: 0, configurable: true });
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

