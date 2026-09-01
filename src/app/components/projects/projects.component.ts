import { Component } from '@angular/core';
import { useTranslation } from '../../services/translation.service';

@Component({
  selector: 'app-projects',
  imports: [],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  readonly data = useTranslation().data;
}

