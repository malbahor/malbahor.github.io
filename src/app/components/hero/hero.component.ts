import { Component, HostListener, signal } from '@angular/core';
import { useTranslation } from '../../services/translation.service';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  readonly data = useTranslation().data;
  readonly isResumeModalOpen = signal(false);

  openResumeModal() {
    this.isResumeModalOpen.set(true);
  }

  closeResumeModal() {
    this.isResumeModalOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeResumeModal();
  }
}

