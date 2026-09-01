import { Component, AfterViewInit, OnDestroy, HostListener, inject, signal, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { useTranslation, type Language } from '../../services/translation.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  private static readonly TOP_THRESHOLD = 100;
  private readonly translation = useTranslation();
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly data = this.translation.data;
  readonly language = this.translation.language;
  readonly activeSection = signal('');
  isMenuOpen = signal(false);
  private observer?: IntersectionObserver;

  ngAfterViewInit() {
    if (!this.isBrowser) {
      return;
    }
    this.observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeSection.set(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: [0, 0.25, 0.5] }
    );

    for (const item of this.data().navbar.navItems) {
      const section = this.document.getElementById(item.href.replace('#', ''));
      if (section) {
        this.observer.observe(section);
      }
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (window.scrollY <= NavbarComponent.TOP_THRESHOLD) {
      this.activeSection.set('#home');
    }
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

