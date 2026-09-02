import { Component, HostListener, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { useTranslation, type Language } from '../../services/translation.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private static readonly TOP_THRESHOLD = 100;
  private static readonly SECTION_OFFSET = 120;
  private readonly translation = useTranslation();
  private readonly document = inject(DOCUMENT);
  readonly data = this.translation.data;
  readonly language = this.translation.language;
  readonly activeSection = signal('#home');
  isMenuOpen = signal(false);

  get currentLang(): Language {
    return this.language();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (window.scrollY <= NavbarComponent.TOP_THRESHOLD) {
      this.activeSection.set('#home');
      return;
    }
    let current = '#home';
    for (const item of this.data().navbar.navItems) {
      const section = this.document.getElementById(item.href.replace('#', ''));
      if (section && section.offsetTop - NavbarComponent.SECTION_OFFSET <= window.scrollY) {
        current = item.href;
      }
    }
    this.activeSection.set(current);
  }

  isActive(href: string): boolean {
    return this.activeSection() === href;
  }

  scrollToSection(event: MouseEvent, sectionId: string) {
    event.preventDefault();
    this.activeSection.set(sectionId);
    this.document.getElementById(sectionId.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
    this.closeMenu();
  }

  setLanguage(lang: Language) {
    this.translation.setLanguage(lang);
    this.closeMenu();
  }

  toggleMenu() {
    this.isMenuOpen.update(prev => !prev);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }
}

