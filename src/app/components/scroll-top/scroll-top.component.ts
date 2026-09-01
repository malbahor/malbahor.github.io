import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrl: './scroll-top.component.scss'
})
export class ScrollTopComponent {
  private static readonly VISIBILITY_THRESHOLD = 300;
  readonly isVisible = signal(false);

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isVisible.set(window.scrollY > ScrollTopComponent.VISIBILITY_THRESHOLD);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
