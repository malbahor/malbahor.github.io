import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { NgForm } from '@angular/forms';

import { ContactComponent } from './contact.component';
import { TranslationService } from '../../services/translation.service';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let httpMock: HttpTestingController;
  let translation: TranslationService;

  const FORMSPREE_URL = 'https://formspree.io/f/mppzdldo';

  beforeEach(async () => {
    localStorage.removeItem('lang');
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: TranslationService,
          useFactory: () => new TranslationService()
        }
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    translation = TestBed.inject(TranslationService);

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the contact form fields', () => {
    const inputs = fixture.debugElement.queryAll(
      By.css('input[name="name"], input[name="email"], input[name="subject"], textarea[name="message"]')
    );
    expect(inputs.length).toBe(4);
  });

  it('should be in idle loading state before submission', () => {
    expect(component.isLoading()).toBe(false);
  });

  describe('Form validation', () => {
    function typeIn(name: string, value: string) {
      const el = fixture.debugElement.query(By.css(`[name="${name}"]`));
      el.nativeElement.value = value;
      el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
      el.nativeElement.dispatchEvent(new Event('change', { bubbles: true }));
    }

    it('should mark all controls as touched and show errors when submitting an empty form', () => {
      const submitBtn = fixture.debugElement.queryAll(By.css('button[type="submit"]'))[0].nativeElement;
      submitBtn.click();
      fixture.detectChanges();

      const errorMessages = fixture.debugElement.queryAll(By.css('.text-rose-400'));
      expect(errorMessages.length).toBe(4);
      expect(component.isLoading()).toBe(false);
    });

    it('should show the invalid email message when email format is wrong', () => {
      typeIn('name', 'Manuel');
      typeIn('email', 'not-an-email');
      typeIn('subject', 'Asunto de prueba');
      typeIn('message', 'Mensaje de prueba');
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('[name="email"]')).nativeElement;
      el.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

            const invalidMsg = fixture.debugElement.queryAll(By.css('.text-rose-400'));
      expect(invalidMsg.length).toBeGreaterThan(0);
    });
  });

  describe('Form submission', () => {
    function typeIn(name: string, value: string) {
      const el = fixture.debugElement.query(By.css(`[name="${name}"]`));
      el.nativeElement.value = value;
      el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
      el.nativeElement.dispatchEvent(new Event('change', { bubbles: true }));
    }

            function getForm(): NgForm {
      return fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);
    }

    async function submitValidForm() {
      typeIn('name', 'Manuel Alba');
      typeIn('email', 'mahx007@gmail.com');
      typeIn('subject', 'Frontend project');
      typeIn('message', 'Estoy interesado en colaborar.');
      fixture.detectChanges();

      const submitBtn = fixture.debugElement.queryAll(By.css('button[type="submit"]'))[0].nativeElement;
      submitBtn.click();
      await fixture.whenStable();
    }

    it('should POST valid form data to Formspree and show success feedback', async () => {
      const form = getForm();
      const payload = { name: 'Manuel Alba', email: 'mahx007@gmail.com', subject: 'Frontend project', message: 'Estoy interesado en colaborar.' };

      Object.keys(payload).forEach(key => {
        const el = fixture.debugElement.query(By.css(`[name="${key}"]`));
        el.nativeElement.value = String((payload as Record<string, string>)[key]);
        el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
      });
      fixture.detectChanges();

      component.handleSubmit(form);

      const req = httpMock.expectOne(FORMSPREE_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      expect(req.request.headers.get('Accept')).toBe('application/json');
      req.flush({ success: true });

      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.isLoading()).toBe(false);
      expect(component.isSubmitted()).toBe(true);
      expect(component.hasError()).toBe(false);
    });

    it('should reset the form and clear loading on a successful (200) response', async () => {
      await submitValidForm();
      const req = httpMock.expectOne(FORMSPREE_URL);
      req.flush({}, { status: 200, statusText: 'OK' });

      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.isLoading()).toBe(false);
      expect(component.isSubmitted()).toBe(true);
    });

    it('should show an error message when Formspree responds with an HTTP error', async () => {
      await submitValidForm();
      const req = httpMock.expectOne(FORMSPREE_URL);
      req.flush({ error: 'spam' }, { status: 400, statusText: 'Bad Request' });

      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.isLoading()).toBe(false);
      expect(component.hasError()).toBe(true);
      expect(component.isSubmitted()).toBe(false);
    });

    it('should not submit when the form is invalid', () => {
      const form = getForm();
      const submitBtn = fixture.debugElement.queryAll(By.css('button[type="submit"]'))[0].nativeElement;
      submitBtn.click();

      expect(component.isLoading()).toBe(false);
      expect(component.hasError()).toBe(false);
      expect(form.invalid).toBe(true);
      httpMock.expectNone(FORMSPREE_URL);
    });

    it('should ignore submit requests while already loading', () => {
      const form = getForm();
      Object.keys({ name: 'A', email: 'a@b.com', subject: 's', message: 'm' }).forEach(k => {
        const el = fixture.debugElement.query(By.css(`[name="${k}"]`));
        el.nativeElement.value = k === 'email' ? 'a@b.com' : 'x';
        el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
      });
      fixture.detectChanges();

      component.isLoading.set(true);
      component.handleSubmit(form);

      httpMock.expectNone(FORMSPREE_URL);
      expect(component.isLoading()).toBe(true);
    });
  });

  describe('Loading & error UI', () => {
    function fillValidForm() {
      const values = { name: 'A', email: 'a@b.com', subject: 's', message: 'm' };
      Object.keys(values).forEach(k => {
        const el = fixture.debugElement.query(By.css(`[name="${k}"]`));
        el.nativeElement.value = String((values as Record<string, string>)[k]);
        el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
      });
      fixture.detectChanges();
    }

    it('should display the success toast after a successful submission', async () => {
      fillValidForm();
            const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);
      component.handleSubmit(form);
      const req = httpMock.expectOne(FORMSPREE_URL);
      req.flush({});

      await fixture.whenStable();
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('[class*="bg-emerald-950"]'))).toBeTruthy();
    });

    it('should display the error toast after a failed submission', async () => {
      fillValidForm();
            const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);
      component.handleSubmit(form);
      const req = httpMock.expectOne(FORMSPREE_URL);
      req.flush({}, { status: 500, statusText: 'Server Error' });

      await fixture.whenStable();
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('[class*="bg-rose-950"]'))).toBeTruthy();
    });
  });
});


