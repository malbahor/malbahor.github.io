import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ManiaChatService, type ManiaMessage } from '../../services/mania-chat.service';
import { TranslationService } from '../../services/translation.service';
import { ManiaChatComponent } from './mania-chat.component';

const flushMicrotasks = async (): Promise<void> => {
  for (let i = 0; i < 20; i++) {
    await Promise.resolve();
  }
};

describe('ManiaChatComponent', () => {
  let component: ManiaChatComponent;
  let fixture: ComponentFixture<ManiaChatComponent>;
  let service: ManiaChatService;
  let translation: TranslationService;

  beforeEach(async () => {
    jest.useFakeTimers();
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
    translation = TestBed.inject(TranslationService);
    translation.setLanguage('en');
    jest.spyOn(service, 'sendMessage').mockResolvedValue(undefined);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
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
    jest.spyOn(service, 'sendMessage').mockImplementation(async (content: string) => {
      const messages: ManiaMessage[] = [
        { role: 'user', content },
        { role: 'assistant', content: 'Manuel Alba works with Angular.' }
      ];
      service.messages.set(messages);
    });
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

  it('should start and cancel the hold state with mouse events', () => {
    component.toggle();
    fixture.detectChanges();
    const holdButton = fixture.debugElement.query(By.css('.hold-btn'));

    holdButton.triggerEventHandler('mousedown', {});
    expect(component.isHolding()).toBe(true);

    holdButton.triggerEventHandler('mouseup', {});
    expect(component.isHolding()).toBe(false);
    expect(component.isResetDone()).toBe(false);
    expect(service.messages()).toEqual([]);
  });

  it('should cancel the hold on mouseleave', () => {
    component.toggle();
    fixture.detectChanges();
    const holdButton = fixture.debugElement.query(By.css('.hold-btn'));
    holdButton.triggerEventHandler('mousedown', {});
    expect(component.isHolding()).toBe(true);

    holdButton.triggerEventHandler('mouseleave', {});
    expect(component.isHolding()).toBe(false);
    expect(component.isResetDone()).toBe(false);
  });

  it('should ignore cancel when not holding', () => {
    component.cancelHold();
    expect(component.isHolding()).toBe(false);
    expect(component.showHoldHint()).toBe(false);
  });

  it('should complete the hold after 1.5 seconds and clear the chat', async () => {
    service.messages.set([{ role: 'user', content: 'angular' }]);
    component.toggle();
    fixture.detectChanges();

    component.startHold();
    fixture.detectChanges();
    expect(component.isHolding()).toBe(true);
    const label = fixture.debugElement.query(By.css('.hold-label'));
    expect(label.nativeElement.textContent).toContain('Resetting chat...');

    jest.advanceTimersByTime(1500);
    expect(component.isHolding()).toBe(false);
    expect(component.isResetDone()).toBe(true);
    expect(service.messages()).toEqual([]);

    fixture.detectChanges();
    const trash = fixture.debugElement.query(By.css('.hold-btn'));
    expect(trash.classes['is-done']).toBe(true);

    jest.advanceTimersByTime(1200);
    expect(component.isResetDone()).toBe(false);
  });

  it('should show the hold label in spanish when the language is es', () => {
    translation.setLanguage('es');
    component.toggle();
    fixture.detectChanges();

    component.startHold();
    fixture.detectChanges();
    const label = fixture.debugElement.query(By.css('.hold-label'));
    expect(label.nativeElement.textContent).toContain('Reiniciando chat...');
  });

  it('should ignore startHold while the reset feedback is visible', () => {
    component.isResetDone.set(true);
    component.startHold();
    expect(component.isHolding()).toBe(false);
  });

  it('should show the hold hint on quick click for 1.5 seconds', () => {
    component.toggle();
    fixture.detectChanges();
    const holdButton = fixture.debugElement.query(By.css('.hold-btn'));

    holdButton.triggerEventHandler('mousedown', {});
    holdButton.triggerEventHandler('mouseup', {});
    expect(component.showHoldHint()).toBe(true);
    fixture.detectChanges();

    const hint = fixture.debugElement.query(By.css('.hold-hint'));
    expect(hint.nativeElement.textContent).toContain('Hold to reset');

    jest.advanceTimersByTime(1500);
    expect(component.showHoldHint()).toBe(false);
  });

  it('should show the hold hint in spanish when the language is es', () => {
    translation.setLanguage('es');
    component.toggle();
    fixture.detectChanges();
    component.startHold();
    component.cancelHold();
    fixture.detectChanges();

    const hint = fixture.debugElement.query(By.css('.hold-hint'));
    expect(hint.nativeElement.textContent).toContain('Mantén pulsado para reiniciar');
  });

  it('should restart the hint timer when a quick click repeats', () => {
    component.startHold();
    component.cancelHold();
    jest.advanceTimersByTime(1000);

    component.startHold();
    component.cancelHold();
    expect(component.showHoldHint()).toBe(true);

    jest.advanceTimersByTime(1000);
    expect(component.showHoldHint()).toBe(true);

    jest.advanceTimersByTime(500);
    expect(component.showHoldHint()).toBe(false);
  });

  it('should handle touch events for the hold interaction', () => {
    component.toggle();
    fixture.detectChanges();
    const holdButton = fixture.debugElement.query(By.css('.hold-btn'));

    holdButton.triggerEventHandler('touchstart', {});
    expect(component.isHolding()).toBe(true);

    holdButton.triggerEventHandler('touchend', {});
    expect(component.isHolding()).toBe(false);

    holdButton.triggerEventHandler('touchstart', {});
    expect(component.isHolding()).toBe(true);
    holdButton.triggerEventHandler('touchcancel', {});
    expect(component.isHolding()).toBe(false);
  });

  it('should scroll the messages container to the bottom on new messages', async () => {
    component.toggle();
    fixture.detectChanges();

    const container = fixture.debugElement.query(By.css('.messages-scroll')).nativeElement;
    let scrollTopValue = 0;
    Object.defineProperty(container, 'scrollTop', {
      get: () => scrollTopValue,
      set: value => {
        scrollTopValue = value;
      },
      configurable: true
    });
    Object.defineProperty(container, 'scrollHeight', { value: 500, configurable: true });

    service.messages.set([
      { role: 'user', content: 'hello' },
      { role: 'assistant', content: 'hi' }
    ]);
    fixture.detectChanges();
    jest.advanceTimersByTime(0);

    expect(scrollTopValue).toBe(500);
  });

  it('should scroll the messages container while loading', async () => {
    component.toggle();
    fixture.detectChanges();

    const container = fixture.debugElement.query(By.css('.messages-scroll')).nativeElement;
    let scrollTopValue = 0;
    Object.defineProperty(container, 'scrollTop', {
      get: () => scrollTopValue,
      set: value => {
        scrollTopValue = value;
      },
      configurable: true
    });
    Object.defineProperty(container, 'scrollHeight', { value: 400, configurable: true });

    service.isLoading.set(true);
    fixture.detectChanges();
    jest.advanceTimersByTime(0);

    expect(scrollTopValue).toBe(400);
  });
});

 
