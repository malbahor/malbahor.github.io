import { Component, HostListener, signal } from '@angular/core';
import { useTranslation } from '../../services/translation.service';
import { replaceYearsPlaceholder } from '../../core/data/cv-data';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  readonly data = useTranslation().data;
  readonly isResumeModalOpen = signal(false);
  readonly resolveText = replaceYearsPlaceholder;

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

