import { computed, inject, Injectable, signal } from '@angular/core';
import enData from '../../assets/data/en.json';
import esData from '../../assets/data/es.json';
import type { AppData } from '../models/app-data';

export type Language = 'en' | 'es';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly en = enData as unknown as AppData;
  private readonly es = esData as unknown as AppData;
  readonly language = signal<Language>(this.getInitialLanguage());
  readonly data = computed(() => (this.language() === 'es' ? this.es : this.en));

  private getInitialLanguage(): Language {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('lang');
      if (saved === 'en' || saved === 'es') {
        return saved;
      }
    }
    return 'en';
  }

  setLanguage(lang: Language): void {
    this.language.set(lang);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('lang', lang);
    }
  }
}

export function useTranslation() {
  return inject(TranslationService);
}