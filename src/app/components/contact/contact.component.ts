import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { useTranslation } from '../../services/translation.service';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mppzdldo';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  private readonly http = inject(HttpClient);
  readonly data = useTranslation().data;

  readonly isSubmitted = signal(false);
  readonly isLoading = signal(false);
  readonly hasError = signal(false);

  async handleSubmit(form: NgForm) {
    if (form.invalid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      return;
    }

    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.hasError.set(false);
    this.isSubmitted.set(false);

    try {
      await firstValueFrom(
        this.http.post(FORMSPREE_ENDPOINT, form.value, {
          headers: { Accept: 'application/json' }
        })
      );
      this.isSubmitted.set(true);
      form.resetForm();
    } catch {
      this.hasError.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }
}



