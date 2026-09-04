import { Component } from '@angular/core';
import { useTranslation } from '../../services/translation.service';
import { replaceYearsPlaceholder } from '../../core/data/cv-data';

@Component({
  selector: 'app-experience',
  imports: [],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent {
  readonly data = useTranslation().data;
  readonly resolveText = replaceYearsPlaceholder;
}

