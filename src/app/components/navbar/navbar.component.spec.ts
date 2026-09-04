import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

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

  it('should cancel the pending animation frame on destroy', () => {
    const cancelSpy = jest.spyOn(window, 'cancelAnimationFrame');
    component['scrollFrameId'] = 42;
    component.ngOnDestroy();
    expect(cancelSpy).toHaveBeenCalledWith(42);
  });

  it('should not schedule a new animation frame if one is already pending', () => {
    const requestSpy = jest.spyOn(window, 'requestAnimationFrame');
    component['scrollFrameId'] = 1;
    component['scheduleScrollUpdate']();
    expect(requestSpy).not.toHaveBeenCalled();
    component['scrollFrameId'] = 0;
  });

  it('should execute the scheduled scroll update on animation frame', () => {
    const requestSpy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 1;
    });
    component['scheduleScrollUpdate']();
    expect(requestSpy).toHaveBeenCalled();
    requestSpy.mockRestore();
  });

  describe('SSR scenarios', () => {
    const originalWindow = window;

    afterEach(() => {
      Object.defineProperty(globalThis, 'window', {
        value: originalWindow,
        writable: true,
        configurable: true
      });
    });

    it('should handle ngAfterViewInit when window is undefined', () => {
      Object.defineProperty(globalThis, 'window', {
        value: undefined,
        writable: true,
        configurable: true
      });
      expect(() => component.ngAfterViewInit()).not.toThrow();
    });

    it('should handle ngOnDestroy when window is undefined', () => {
      Object.defineProperty(globalThis, 'window', {
        value: undefined,
        writable: true,
        configurable: true
      });
      expect(() => component.ngOnDestroy()).not.toThrow();
    });

    it('should handle onWindowScroll when window is undefined', () => {
      Object.defineProperty(globalThis, 'window', {
        value: undefined,
        writable: true,
        configurable: true
      });
      expect(() => component.onWindowScroll()).not.toThrow();
    });

    it('should handle isNearDocumentBottom when body scrollHeight is null', () => {
      const mockDoc = {
        scrollHeight: 3000
      };
      jest.spyOn(document, 'documentElement', 'get').mockReturnValue(mockDoc as any);
      Object.defineProperty(document, 'body', { value: null, configurable: true });
      Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
      Object.defineProperty(window, 'scrollY', { value: 2400, configurable: true });

      component.onWindowScroll();
      expect(component.activeSection()).toBeTruthy();

      Object.defineProperty(document, 'body', { value: document.body, configurable: true });
    });
  });

