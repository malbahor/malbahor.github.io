import { Component } from '@angular/core';
import { useTranslation } from '../../services/translation.service';
import { replaceYearsPlaceholder } from '../../core/data/cv-data';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  readonly data = useTranslation().data;
  readonly resolveText = replaceYearsPlaceholder;
}

