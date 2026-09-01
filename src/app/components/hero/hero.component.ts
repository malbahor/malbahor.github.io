import { Component } from '@angular/core';
import { useTranslation } from '../../services/translation.service';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  readonly data = useTranslation().data;
}

