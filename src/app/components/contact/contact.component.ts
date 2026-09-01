import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { useTranslation } from '../../services/translation.service';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  readonly data = useTranslation().data;
  isSubmitted = signal(false);

  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  handleSubmit(event: Event) {
    event.preventDefault();
    if (this.formData.name && this.formData.email && this.formData.message) {
      this.isSubmitted.set(true);
      setTimeout(() => {
        this.isSubmitted.set(false);
        this.formData = { name: '', email: '', subject: '', message: '' };
      }, 4000);
    }
  }
}

