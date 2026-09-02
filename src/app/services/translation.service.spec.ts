import { TestBed } from '@angular/core/testing';

import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(() => {
    localStorage.removeItem('lang');
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to English when no language is saved', () => {
    expect(service.language()).toBe('en');
  });

  it('should return English data by default', () => {
    expect(service.data().navbar.navItems[0].label).toBe('Home');
  });

  it('should return Spanish data when language is set to es', () => {
    service.setLanguage('es');
    expect(service.language()).toBe('es');
    expect(service.data().navbar.navItems[0].label).toBe('Inicio');
  });

  it('should keep English data when language is en', () => {
    service.setLanguage('en');
    expect(service.data().contact.eyebrow).toBe('Contact');
  });

  it('should persist the selected language in localStorage', () => {
    service.setLanguage('es');
    expect(localStorage.getItem('lang')).toBe('es');
  });

  it('should restore the saved language from localStorage on init', () => {
    service.setLanguage('es');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const fresh = TestBed.inject(TranslationService);
    expect(fresh.language()).toBe('es');
    localStorage.removeItem('lang');
  });

  it('should ignore invalid saved language values', () => {
    localStorage.setItem('lang', 'fr');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const fresh = TestBed.inject(TranslationService);
    expect(fresh.language()).toBe('en');
    localStorage.removeItem('lang');
  });
});

