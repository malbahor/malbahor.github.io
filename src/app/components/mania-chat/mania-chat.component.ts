import { Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ManiaChatService } from '../../services/mania-chat.service';
import { useTranslation } from '../../services/translation.service';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-mania-chat',
  imports: [FormsModule, SafeHtmlPipe],
  templateUrl: './mania-chat.component.html',
  styleUrl: './mania-chat.component.scss'
})
export class ManiaChatComponent {
  private readonly service = inject(ManiaChatService);
  private readonly translation = useTranslation();
  readonly data = this.translation.data;
  readonly language = this.translation.language;
  readonly isOpen = signal(false);
  readonly draft = signal('');
  readonly isLoading = this.service.isLoading;
  readonly messages = this.service.messages;
  readonly hasMessages = this.service.hasMessages;
  readonly hasError = signal(false);
  readonly isInputEmpty = computed(() => this.draft().trim().length === 0);
  readonly isHolding = signal(false);
  readonly isResetDone = signal(false);
  readonly showHoldHint = signal(false);
  private holdTimer: ReturnType<typeof setTimeout> | null = null;
  private resetTimer: ReturnType<typeof setTimeout> | null = null;
  private hintTimer: ReturnType<typeof setTimeout> | null = null;
  private holdStartedAt = 0;

  private static readonly HOLD_DURATION_MS = 1500;
  private static readonly RESET_FEEDBACK_MS = 1200;
  private static readonly HINT_FEEDBACK_MS = 1500;
  private static readonly QUICK_CLICK_THRESHOLD_MS = 300;

  private readonly messagesContainer = viewChild<ElementRef<HTMLDivElement>>('messagesContainer');
  private lastScrollCount = -1;

  constructor() {
    effect(() => {
      const count = this.messages().length;
      const loading = this.isLoading();
      const container = this.messagesContainer()?.nativeElement;
      if (container && (count > this.lastScrollCount || (loading && count === this.lastScrollCount))) {
        queueMicrotask(() => {
          container.scrollTop = container.scrollHeight;
        });
      }
      this.lastScrollCount = count;
    });
  }

  get isOpenLabel(): string {
    return this.isOpen() ? this.data().mania.closeAria : this.data().mania.fabAria;
  }

  toggle(): void {
    this.isOpen.update(value => !value);
  }

  async send(): Promise<void> {
    const content = this.draft().trim();
    if (!content || this.isLoading()) {
      return;
    }
    this.hasError.set(false);
    this.draft.set('');
    try {
      await this.service.sendMessage(content);
    } catch {
      this.hasError.set(true);
    }
  }

  clearChat(): void {
    this.service.reset();
    this.hasError.set(false);
  }

  startHold(): void {
    if (this.isHolding() || this.isResetDone()) {
      return;
    }
    this.isHolding.set(true);
    this.holdStartedAt = Date.now();
    this.holdTimer = setTimeout(() => this.completeHold(), ManiaChatComponent.HOLD_DURATION_MS);
  }

  cancelHold(): void {
    if (!this.isHolding()) {
      return;
    }
    if (this.holdTimer !== null) {
      clearTimeout(this.holdTimer);
      this.holdTimer = null;
    }
    this.isHolding.set(false);

    const elapsed = Date.now() - this.holdStartedAt;
    if (elapsed < ManiaChatComponent.QUICK_CLICK_THRESHOLD_MS) {
      this.displayHoldHint();
    }
  }

  private displayHoldHint(): void {
    if (this.hintTimer !== null) {
      clearTimeout(this.hintTimer);
    }
    this.showHoldHint.set(true);
    this.hintTimer = setTimeout(() => {
      this.hintTimer = null;
      this.showHoldHint.set(false);
    }, ManiaChatComponent.HINT_FEEDBACK_MS);
  }

  private completeHold(): void {
    this.holdTimer = null;
    this.isHolding.set(false);
    this.isResetDone.set(true);
    this.clearChat();
    this.resetTimer = setTimeout(() => this.isResetDone.set(false), ManiaChatComponent.RESET_FEEDBACK_MS);
  }
}