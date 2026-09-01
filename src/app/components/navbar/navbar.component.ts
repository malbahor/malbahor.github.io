import { Component, signal } from '@angular/core';
import { useTranslation, type Language } from '../../services/translation.service';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private readonly translation = useTranslation();
  readonly data = this.translation.data;
  readonly language = this.translation.language;
  isMenuOpen = signal(false);

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

