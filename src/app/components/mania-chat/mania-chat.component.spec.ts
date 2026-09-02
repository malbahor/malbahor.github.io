import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ManiaChatService } from '../../services/mania-chat.service';
import { ManiaChatComponent } from './mania-chat.component';

describe('ManiaChatComponent', () => {
  let component: ManiaChatComponent;
  let fixture: ComponentFixture<ManiaChatComponent>;
  let service: ManiaChatService;

  beforeEach(async () => {
    localStorage.removeItem('lang');
    await TestBed.configureTestingModule({
      imports: [ManiaChatComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        ManiaChatService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManiaChatComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ManiaChatService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the FAB button initially', () => {
    const fab = fixture.debugElement.query(By.css('button[aria-label]'));
    expect(fab).toBeTruthy();
    expect(component.isOpen()).toBe(false);
  });

  it('should toggle open and closed via the FAB', () => {
    component.toggle();
    expect(component.isOpen()).toBe(true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('section'))).toBeTruthy();

    component.toggle();
    expect(component.isOpen()).toBe(false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('section'))).toBeFalsy();
  });

  it('should render the greeting when there are no messages', () => {
    component.toggle();
    fixture.detectChanges();
    const greeting = fixture.debugElement.query(By.css('section .space-y-3 p'));
    expect(greeting.nativeElement.textContent).toContain(component.data().mania.greeting);
  });

  it('should render assistant message after sending', async () => {
    component.toggle();
    component.draft.set('angular experience');
    await component.send();
    fixture.detectChanges();

    expect(service.messages().length).toBe(2);
    expect(service.messages()[1].role).toBe('assistant');
    expect(component.draft()).toBe('');

    const bubbles = fixture.debugElement.queryAll(By.css('section .space-y-3 > div'));
    expect(bubbles.length).toBe(2);
  });

  it('should disable the send button when input is empty', () => {
    component.draft.set('');
    component.toggle();
    fixture.detectChanges();

    const sendButton = fixture.debugElement.query(By.css('footer button[type="submit"]'));
    expect(sendButton.nativeElement.disabled).toBe(true);
  });

  it('should disable the send button while loading', () => {
    component.isLoading.set(true);
    component.draft.set('angular');
    component.toggle();
    fixture.detectChanges();

    const sendButton = fixture.debugElement.query(By.css('footer button[type="submit"]'));
    expect(sendButton.nativeElement.disabled).toBe(true);
  });

  it('should not send when draft is empty', async () => {
    component.draft.set('   ');
    await component.send();
    expect(service.messages()).toEqual([]);
  });

  it('should show an error message when the service throws', async () => {
    jest.spyOn(service, 'sendMessage').mockRejectedValueOnce(new Error('fail'));
    component.toggle();
    component.draft.set('angular');
    await component.send();
    fixture.detectChanges();

    expect(component.hasError()).toBe(true);
    const error = fixture.debugElement.query(By.css('section .text-rose-400'));
    expect(error.nativeElement.textContent).toContain(component.data().mania.unexpectedError);
  });

  it('should clear the chat and reset error state', async () => {
    component.draft.set('angular');
    await component.send();
    component.hasError.set(true);
    fixture.detectChanges();

    component.clearChat();
    expect(service.messages()).toEqual([]);
    expect(component.hasError()).toBe(false);
  });

  it('should clear error on new send attempt', async () => {
    component.hasError.set(true);
    component.draft.set('angular');
    await component.send();
    expect(component.hasError()).toBe(false);
  });

  it('should reflect the aria label based on open state', () => {
    expect(component.isOpenLabel).toBe(component.data().mania.fabAria);
    component.toggle();
    expect(component.isOpenLabel).toBe(component.data().mania.closeAria);
  });
});

 
