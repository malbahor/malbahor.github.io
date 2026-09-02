import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import {
  ManiaChatService,
  MANIA_SYSTEM_PROMPT,
  MANIA_GUARDRAIL_RESPONSE,
  MANIA_API_KEY
} from './mania-chat.service';

describe('ManiaChatService', () => {
  let service: ManiaChatService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        ManiaChatService
      ]
    });
    service = TestBed.inject(ManiaChatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose empty messages and not loading initially', () => {
    expect(service.messages()).toEqual([]);
    expect(service.isLoading()).toBe(false);
    expect(service.hasMessages()).toBe(false);
  });

  it('should not send when content is empty', async () => {
    await service.sendMessage('   ');
    expect(service.messages()).toEqual([]);
    expect(service.isLoading()).toBe(false);
  });

  it('should not send when already loading', async () => {
    service.isLoading.set(true);
    await service.sendMessage('angular experience');
    expect(service.messages()).toEqual([]);
  });

  it('should return guardrail response for off-topic messages', async () => {
    await service.sendMessage('what is the weather today');
    expect(service.messages().length).toBe(2);
    expect(service.messages()[0].role).toBe('user');
    expect(service.messages()[1].role).toBe('assistant');
    expect(service.messages()[1].content).toBe(MANIA_GUARDRAIL_RESPONSE);
    expect(service.isLoading()).toBe(false);
  });

  it('should detect on-topic keywords', () => {
    expect(service.isOnTopic('Tell me about Angular')).toBe(true);
    expect(service.isOnTopic('experience')).toBe(true);
    expect(service.isOnTopic('testing with Jest')).toBe(true);
    expect(service.isOnTopic('education')).toBe(true);
  });

  it('should detect off-topic keywords', () => {
    expect(service.isOnTopic('what is the weather')).toBe(false);
    expect(service.isOnTopic('tell me a joke')).toBe(false);
    expect(service.isOnTopic('who won the game')).toBe(false);
  });

  it('should use fallback response when no API key is set', async () => {
    await service.sendMessage('angular experience');
    expect(service.messages().length).toBe(2);
    expect(service.messages()[0].role).toBe('user');
    expect(service.messages()[1].role).toBe('assistant');
    expect(service.messages()[1].content).toContain('Manuel Alba');
    expect(service.isLoading()).toBe(false);
  });

  it('should reset messages and loading state', async () => {
    await service.sendMessage('angular');
    expect(service.hasMessages()).toBe(true);
    service.reset();
    expect(service.messages()).toEqual([]);
    expect(service.isLoading()).toBe(false);
    expect(service.hasMessages()).toBe(false);
  });

  it('should rethrow when requestCompletion fails', async () => {
    jest.spyOn(service as any, 'requestCompletion').mockRejectedValueOnce(new Error('network error'));
    await expect(service.sendMessage('angular')).rejects.toThrow('MANIA_REQUEST_FAILED');
    expect(service.messages().length).toBe(1);
    expect(service.messages()[0].role).toBe('user');
    expect(service.isLoading()).toBe(false);
  });

  it('should make HTTP request when API key is set', async () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        ManiaChatService,
        { provide: MANIA_API_KEY, useValue: 'test-api-key' }
      ]
    });
    const freshService = TestBed.inject(ManiaChatService);
    httpMock = TestBed.inject(HttpTestingController);
    const promise = freshService.sendMessage('angular');
    const req = httpMock.expectOne('https://api.openai.com/v1/chat/completions');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-api-key');
    expect(req.request.body.model).toBe('gpt-4o-mini');
    expect(req.request.body.messages[0].role).toBe('system');
    expect(req.request.body.messages[1].content).toBe('angular');
    req.flush({ choices: [{ message: { content: 'Manuel Alba is a Senior Frontend Engineer.' } }] });
    await promise;
    expect(freshService.messages()[1].content).toBe('Manuel Alba is a Senior Frontend Engineer.');
  });
    expect(MANIA_SYSTEM_PROMPT).toContain('ManIA');
    expect(MANIA_SYSTEM_PROMPT).toContain('Manuel Alba');
  });

  it('should expose the guardrail response constant', () => {
    expect(MANIA_GUARDRAIL_RESPONSE).toContain('professional experience');
  });
});

import { TestBed } from '@angular/core/testing'; 
