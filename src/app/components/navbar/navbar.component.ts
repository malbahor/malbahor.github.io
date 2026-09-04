import { AfterViewInit, Component, NgZone, OnDestroy, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { useTranslation, type Language } from '../../services/translation.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  private static readonly VIEWPORT_ANCHOR_RATIO = 0.3;
  private static readonly BOTTOM_TOLERANCE = 20;
  private static readonly SCROLL_INIT_GRACE_MS = 300;
  private readonly translation = useTranslation();
  private readonly document = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private scrollFrameId = 0;
  private readonly handleScrollEvent = (): void => this.scheduleScrollUpdate();
  private initializedAt = 0;
  readonly data = this.translation.data;
  readonly language = this.translation.language;
  readonly activeSection = signal('#home');
  isMenuOpen = signal(false);

  get currentLang(): Language {
    return this.language();
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') {
      return;
    }
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.handleScrollEvent, { passive: true });
      window.addEventListener('resize', this.handleScrollEvent, { passive: true });
    });
    this.initializedAt = Date.now();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  ngOnDestroy(): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.removeEventListener('scroll', this.handleScrollEvent);
    window.removeEventListener('resize', this.handleScrollEvent);
    if (this.scrollFrameId) {
      cancelAnimationFrame(this.scrollFrameId);
      this.scrollFrameId = 0;
    }
  }

  onWindowScroll(): void {
    if (typeof window === 'undefined') {
      return;
    }
    if (Date.now() - this.initializedAt < NavbarComponent.SCROLL_INIT_GRACE_MS) {
      return;
    }
    if (this.isNearDocumentBottom()) {
      this.setActiveSection(this.lastSectionHref());
      return;
    }
    this.setActiveSection(this.sectionAtViewportAnchor());
  }

  isActive(href: string): boolean {
    return this.activeSection() === href;
  }

  scrollToSection(event: MouseEvent, sectionId: string) {
    event.preventDefault();
    this.setActiveSection(sectionId);
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

  private scheduleScrollUpdate(): void {
    if (this.scrollFrameId) {
      return;
    }
    this.scrollFrameId = requestAnimationFrame(() => {
      this.scrollFrameId = 0;
      this.onWindowScroll();
    });
  }

  private setActiveSection(href: string): void {
    if (this.activeSection() === href) {
      return;
    }
    this.zone.run(() => this.activeSection.set(href));
  }

  private sectionAtViewportAnchor(): string {
    const anchor = window.innerHeight * NavbarComponent.VIEWPORT_ANCHOR_RATIO;
    let lastPassed = '';
    for (const item of this.data().navbar.navItems) {
      const section = this.document.getElementById(item.href.replace('#', ''));
      if (!section || typeof section.getBoundingClientRect !== 'function') {
        continue;
      }
      const rect = section.getBoundingClientRect();
      if (rect.top <= anchor && rect.bottom > anchor) {
        return item.href;
      }
      if (rect.top <= anchor) {
        lastPassed = item.href;
      }
    }
    return lastPassed || '#home';
  }

  private lastSectionHref(): string {
    const items = this.data().navbar.navItems;
    return items[items.length - 1].href;
  }

  private isNearDocumentBottom(): boolean {
    const doc = this.document.documentElement;
    const docBody = (this.document as Document).body;
    const scrollHeight = Math.max(doc.scrollHeight, docBody?.scrollHeight ?? 0);
    return scrollHeight > window.innerHeight
      && window.innerHeight + window.scrollY >= scrollHeight - NavbarComponent.BOTTOM_TOLERANCE;
  }
}

