import { Component } from '@angular/core';
import { useTranslation } from '../../services/translation.service';

@Component({
  selector: 'app-experience',
  imports: [],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent {
  readonly data = useTranslation().data;
}

