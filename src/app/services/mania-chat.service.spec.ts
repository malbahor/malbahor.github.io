import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { ManiaChatService, MANIA_API_KEY } from './mania-chat.service';
import { TranslationService } from './translation.service';
import { MANUEL_CV_DATA, getYearsOfExperience } from '../core/data/cv-data';

const flushMicrotasks = async (): Promise<void> => {
  for (let i = 0; i < 20; i++) {
    await Promise.resolve();
  }
};

describe('ManiaChatService', () => {
  let service: ManiaChatService;
  let httpMock: HttpTestingController;
  let translation: TranslationService;

  const send = async (content: string): Promise<void> => {
    const promise = service.sendMessage(content);
    jest.advanceTimersByTime(1000);
    await promise;
  };

  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.removeItem('lang');
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        ManiaChatService
      ]
    });
    service = TestBed.inject(ManiaChatService);
    httpMock = TestBed.inject(HttpTestingController);
    translation = TestBed.inject(TranslationService);
    translation.setLanguage('en');
  });

  afterEach(() => {
    ManiaChatService.setApiKeyOverride(null);
    httpMock.verify();
    jest.useRealTimers();
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

  it('should not send when already loading', () => {
    service.isLoading.set(true);
    service.sendMessage('angular experience');
    jest.advanceTimersByTime(1000);
    expect(service.messages()).toEqual([]);
  });

  it('should answer the current role in spanish when asked for the position', async () => {
    translation.setLanguage('es');
    await send('¿cuál es su puesto?');
    expect(service.messages().length).toBe(2);
    expect(service.messages()[1].content).toContain(MANUEL_CV_DATA.title.es);
    expect(service.isLoading()).toBe(false);
  });

  it('should answer the current role in english when asked for the role', async () => {
    await send('what is his role?');
    expect(service.messages()[1].content).toContain(MANUEL_CV_DATA.title.en);
  });

  it('should answer the testing milestone', async () => {
    await send('testing with jest');
    expect(service.messages()[1].content).toContain('Jest');
  });

  it('should answer the testing milestone in spanish', async () => {
    translation.setLanguage('es');
    await send('háblame de su testing');
    expect(service.messages()[1].content).toContain('Jasmine/Karma');
  });

  it('should answer projects in spanish', async () => {
    translation.setLanguage('es');
    await send('cuéntame sus proyectos');
    const content = service.messages()[1].content;
    const matches = MANUEL_CV_DATA.projects.some(p => content.includes(p.name.es));
    expect(matches).toBe(true);
  });

  it('should answer the general profile summary in spanish', async () => {
    translation.setLanguage('es');
    await send('¿quién es manuel? sobre su perfil');
    expect(service.messages()[1].content).toContain(MANUEL_CV_DATA.summary.es);
  });

  it('should answer the stack in english', async () => {
    await send('what is his stack?');
    expect(service.messages()[1].content).toContain(MANUEL_CV_DATA.stack[0]);
  });

  it('should answer the stack in spanish', async () => {
    translation.setLanguage('es');
    await send('cuál es su stack?');
    expect(service.messages()[1].content).toContain(MANUEL_CV_DATA.stack[0]);
  });

  it('should answer projects', async () => {
    await send('tell me about his projects');
    const content = service.messages()[1].content;
    const matches = MANUEL_CV_DATA.projects.some(p => content.includes(p.name.en));
    expect(matches).toBe(true);
  });

  it('should answer education in spanish', async () => {
    translation.setLanguage('es');
    await send('cuéntame su formación');
    expect(service.messages()[1].content).toContain(MANUEL_CV_DATA.education[0].degree.es);
    expect(service.messages()[1].content).toContain(MANUEL_CV_DATA.certifications[0].name.es);
  });

  it('should answer education in english', async () => {
    await send('what about his education?');
    expect(service.messages()[1].content).toContain(MANUEL_CV_DATA.education[0].degree.en);
  });

  it('should answer contact details in spanish', async () => {
    translation.setLanguage('es');
    await send('necesito su contacto');
    expect(service.messages()[1].content).toContain(MANUEL_CV_DATA.contact.email);
    expect(service.messages()[1].content).toContain('Puedes contactar');
  });

  it('should answer contact details in english', async () => {
    await send('how can I contact him?');
    expect(service.messages()[1].content).toContain(MANUEL_CV_DATA.contact.email);
    expect(service.messages()[1].content).toContain('You can reach');
  });

  it('should answer the general profile summary', async () => {
    await send('who is manuel? about his profile');
    expect(service.messages()[1].content).toContain(MANUEL_CV_DATA.summary.en);
  });

  it('should answer the experience with the relevant company when mentioned', async () => {
    await send('his experience at Deloitte');
    expect(service.messages()[1].content).toContain('Deloitte');
  });

  it('should answer the experience with a random role when no company is mentioned', async () => {
    await send('his experience');
    const content = service.messages()[1].content;
    const matches = MANUEL_CV_DATA.experience.some(e => content.includes(e.company));
    expect(matches).toBe(true);
  });

  it('should return an off-topic response in spanish for unrelated queries', async () => {
    translation.setLanguage('es');
    await send('cuéntame un chiste');
    expect(service.messages().length).toBe(2);
    expect(service.messages()[0].role).toBe('user');
    expect(service.messages()[1].role).toBe('assistant');
    expect(service.messages()[1].content).toContain('Manuel Alba');
  });

  it('should return an off-topic response in english for unrelated queries', async () => {
    await send('tell me a joke');
    expect(service.messages()[1].content).toContain('Manuel Alba');
  });

  it('should return an off-topic response when the query has no tokens', async () => {
    await send('???');
    expect(service.messages()[1].content).toContain('Manuel Alba');
  });

  it('should treat a first short follow-up without history as off-topic', async () => {
    await send('y actualmente?');
    expect(service.messages()[1].content).toContain('Manuel Alba');
  });

  it('should answer follow-up questions about the current role in context', async () => {
    translation.setLanguage('es');
    service.messages.set([
      { role: 'user', content: 'angular experience' },
      { role: 'assistant', content: 'He works with Angular.' }
    ]);
    await send('y actualmente?');
    expect(service.messages()[3].content).toContain('Actualmente se desempeña como');
    expect(service.messages()[3].content).toContain('NTT DATA');
  });

  it('should answer follow-up questions in english with unshown facts', async () => {
    service.messages.set([
      { role: 'user', content: 'angular' },
      { role: 'assistant', content: 'ok' }
    ]);
    await send('what else?');
    const content = service.messages()[3].content;
    const keywords = ['legacy', 'Jest', 'MongoDB', 'AI', 'Design System', 'Certification'];
    expect(keywords.some(keyword => content.includes(keyword))).toBe(true);
  });

  it('should answer the current role for english role follow-ups in context', async () => {
    service.messages.set([
      { role: 'user', content: 'angular' },
      { role: 'assistant', content: 'ok' }
    ]);
    await send('and currently?');
    expect(service.messages()[3].content).toContain('He currently works as a');
    expect(service.messages()[3].content).toContain('NTT DATA');
  });

  it('should detect single-term follow-ups in context', async () => {
    service.messages.set([
      { role: 'user', content: 'angular' },
      { role: 'assistant', content: 'ok' }
    ]);
    await send('currently?');
    expect(service.messages()[3].content).toContain('He currently works as a');
    expect(service.messages()[3].content).toContain('NTT DATA');
  });

  it('should not treat long follow-ups as context questions', async () => {
    service.messages.set([
      { role: 'user', content: 'angular' },
      { role: 'assistant', content: 'ok' }
    ]);
    await send('else what happened in the year two thousand');
    expect(service.messages()[3].content).toContain('Manuel Alba');
  });

  it('should not treat symbol only follow-ups as context questions', async () => {
    service.messages.set([
      { role: 'user', content: 'angular' },
      { role: 'assistant', content: 'ok' }
    ]);
    await send('???');
    expect(service.messages()[3].content).toContain('Manuel Alba');
  });

  it('should follow up with an intent answer when the follow-up carries a topic', () => {
    const answer = (service as any).buildFollowUpAnswer('y su experiencia en NTT DATA', 'es');
    expect(answer).toContain('NTT DATA');
  });

  it('should never repeat a follow-up fact until the pool is exhausted', () => {
    const facts = new Set<string>();
    for (let i = 0; i < 5; i++) {
      facts.add((service as any).pickUnshownFact('en').en);
    }
    expect(facts.size).toBe(5);
    const sixth = (service as any).pickUnshownFact('en').en;
    expect(facts.has(sixth)).toBe(true);
  });

  it('should match aliases as on-topic', async () => {
    await send('manolo');
    expect(service.messages().length).toBe(2);
    expect(service.messages()[1].content).not.toBe('');
  });

  it('should simulate a 1 second delay before answering', async () => {
    const promise = service.sendMessage('angular');
    await flushMicrotasks();
    expect(service.isLoading()).toBe(true);
    jest.advanceTimersByTime(999);
    await flushMicrotasks();
    expect(service.messages().length).toBe(1);
    jest.advanceTimersByTime(1);
    await promise;
    expect(service.messages().length).toBe(2);
    expect(service.isLoading()).toBe(false);
  });

  it('should reset messages, loading state and used facts', async () => {
    await send('angular');
    expect(service.hasMessages()).toBe(true);
    service.reset();
    expect(service.messages()).toEqual([]);
    expect(service.isLoading()).toBe(false);
    expect(service.hasMessages()).toBe(false);
  });

  it('should expose the api key constant', () => {
    expect(MANIA_API_KEY).toBe('');
  });

  it('should build a system prompt in both languages', () => {
    const esPrompt = (service as any).buildSystemPrompt('es');
    const enPrompt = (service as any).buildSystemPrompt('en');
    expect(esPrompt).toContain('ManIA');
    expect(esPrompt).toContain('Responde SIEMPRE en español');
    expect(enPrompt).toContain("answer only about Manuel Alba's professional career");
    expect(enPrompt).toContain(MANUEL_CV_DATA.title.en);
  });

  it('should request a completion and resolve its content', async () => {
    service.messages.set([{ role: 'assistant', content: 'previous answer' }]);
    const promise = (service as any).requestCompletion('angular', 'en');
    const req = httpMock.expectOne('https://api.openai.com/v1/chat/completions');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${MANIA_API_KEY}`);
    expect(req.request.body.model).toBe('gpt-4o-mini');
    expect(req.request.body.messages[0].role).toBe('system');
    expect(req.request.body.messages[1].content).toBe('previous answer');
    expect(req.request.body.messages[2].content).toBe('angular');
    req.flush({ choices: [{ message: { content: 'Manuel Alba is a Senior Frontend Engineer.' } }] });
    jest.advanceTimersByTime(1000);
    await expect(promise).resolves.toBe('Manuel Alba is a Senior Frontend Engineer.');
  });

  it('should use the remote completion when an api key override is set', async () => {
    ManiaChatService.setApiKeyOverride('test-key');
    const promise = service.sendMessage('angular');
    const req = httpMock.expectOne('https://api.openai.com/v1/chat/completions');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-key');
    req.flush({ choices: [{ message: { content: 'Remote answer about Manuel.' } }] });
    jest.advanceTimersByTime(1000);
    await promise;
    expect(service.messages()[1].content).toBe('Remote answer about Manuel.');
  });

  it('should fall back to the local engine when the remote completion fails', async () => {
    ManiaChatService.setApiKeyOverride('test-key');
    jest.spyOn(service as any, 'requestCompletion').mockRejectedValueOnce(new Error('network error'));
    const promise = service.sendMessage('angular');
    await flushMicrotasks();
    jest.advanceTimersByTime(1000);
    await promise;
    expect(service.messages().length).toBe(2);
    expect(service.messages()[1].content).not.toBe('');
    expect(service.isLoading()).toBe(false);
  });

  it('should reject the completion when the response is empty', async () => {
    const promise = (service as any).requestCompletion('angular', 'en');
    const req = httpMock.expectOne('https://api.openai.com/v1/chat/completions');
    req.flush({ choices: [{ message: { content: '' } }] });
    jest.advanceTimersByTime(1000);
    await expect(promise).rejects.toThrow('Empty completion');
  });

  it('should remember NTT DATA context on follow-up questions', async () => {
    translation.setLanguage('es');
    await send('cuéntame su trabajo en NTT DATA');
    await send('y qué ha hecho allí?');
    const content = service.messages()[3].content;
    expect(content).toContain('NTT DATA');
    expect(content).toContain('Angular');
    expect(content).toContain('Jenkins');
    expect(content).toContain('MongoDB');
  });

  it('should remember Deloitte context on follow-up questions', async () => {
    await send('tell me about his work at Deloitte');
    await send('what did he do there?');
    const content = service.messages()[3].content;
    expect(content).toContain('Deloitte');
    expect(content).toContain('Ionic');
    expect(content).toContain('Storybook');
    expect(content).toContain('Java');
  });

  it('should answer NTT projects directly with company details', async () => {
    translation.setLanguage('es');
    await send('proyectos en ntt');
    expect(service.messages()[1].content).toContain('NTT DATA');
    expect(service.messages()[1].content).toContain('responsabilidades');
  });

  it('should answer Deloitte tasks directly with company details', async () => {
    await send('tasks at Deloitte');
    expect(service.messages()[1].content).toContain('Deloitte');
    expect(service.messages()[1].content).toContain('responsibilities');
  });

  it('should answer stack of NTT with the company technologies', async () => {
    await send('stack de ntt');
    expect(service.messages()[1].content).toContain('NTT DATA');
    expect(service.messages()[1].content).toContain('Postman');
  });

  it('should use the last entity for vague follow-ups like cuéntame más', async () => {
    translation.setLanguage('es');
    (service as any).lastEntity = 'deloitte';
    await send('cuéntame más');
    const content = service.messages()[1].content;
    expect(content).toContain('Deloitte');
    expect(content).toContain('Storybook');
    expect(content).toContain('Scrum');
  });

  it('should not use company context when no entity is known', () => {
    expect((service as any).isCompanyContextQuery('responsabilidades')).toBe(false);
    expect((service as any).buildCompanyDetailsAnswer('responsabilidades', 'es')).toBe('');
  });

  it('should clear the last entity on reset', async () => {
    await send('proyectos en ntt');
    expect((service as any).lastEntity).toBe('ntt');
    service.reset();
    expect((service as any).lastEntity).toBeNull();
  });

  it('should extract companies from queries', () => {
    expect((service as any).extractCompany('stack de NTT data')).toBe('ntt');
    expect((service as any).extractCompany('tareas en Deloitte')).toBe('deloitte');
    expect((service as any).extractCompany('his experience')).toBeNull();
  });

  it('should download the spanish cv for spanish queries', async () => {
    translation.setLanguage('es');
    await send('descargar cv');
    expect(service.messages()[1].content).toContain('manuel_alba_cv_es.pdf');
    expect(service.messages()[1].content).toContain('CV_Manuel_Alba_ES.pdf');
  });

  it('should download the english cv for english queries', async () => {
    await send('download the cv');
    expect(service.messages()[1].content).toContain('manuel_alba_cv_en.pdf');
    expect(service.messages()[1].content).toContain('CV_Manuel_Alba_EN.pdf');
  });

  it('should calculate tenure dynamically from july 2024', () => {
    const calc = (service as any).calculateTenure.bind(service);
    expect(calc('2024-07-01', new Date(2025, 5, 1))).toEqual({ years: 0, months: 11 });
    expect(calc('2024-07-01', new Date(2026, 0, 1))).toEqual({ years: 1, months: 6 });
    expect(calc('2024-07-01', new Date(2027, 8, 1))).toEqual({ years: 3, months: 2 });
  });

  it('should format tenure in both languages', () => {
    const format = (service as any).formatTenure.bind(service);
    expect(format(3, 10, 'es')).toBe('3 años y 10 meses');
    expect(format(1, 0, 'es')).toBe('1 año');
    expect(format(0, 5, 'es')).toBe('5 meses');
    expect(format(3, 10, 'en')).toBe('3 years and 10 months');
    expect(format(1, 0, 'en')).toBe('1 year');
    expect(format(0, 1, 'en')).toBe('1 month');
  });

  it('should compute years of experience dynamically', () => {
    const years = getYearsOfExperience();
    const expected = new Date().getFullYear() - 2020;
    expect(years).toBeGreaterThanOrEqual(expected);
    expect(years).toBeLessThanOrEqual(expected + 1);
  });

  it('should answer the tenure of deloitte with the exact duration', async () => {
    translation.setLanguage('es');
    await send('cuánto estuvo en Deloitte');
    expect(service.messages()[1].content).toContain('Deloitte');
    expect(service.messages()[1].content).toContain('3 años y 10 meses');
  });

  it('should answer remote work and relocation for recruiters', async () => {
    translation.setLanguage('es');
    await send('¿puede trabajar en remoto o trasladarse al extranjero?');
    const content = service.messages()[1].content;
    expect(content).toContain('internacional');
    expect(['remoto', 'migrar', 'reubicarse'].some(word => content.includes(word))).toBe(true);
  });

  it('should answer salary expectations amicably for recruiters', async () => {
    await send('how much does he charge? what is his rate?');
    const content = service.messages()[1].content;
    expect(['proposal', 'project', 'salary'].some(word => content.includes(word))).toBe(true);
  });

  it('should answer the notice period for recruiters', async () => {
    translation.setLanguage('es');
    await send('¿cuánto tarda en incorporarse? ¿cuál es su preaviso?');
    expect(service.messages()[1].content).toContain('15 días');
  });

  it('should answer the english level for recruiters', async () => {
    translation.setLanguage('es');
    await send('¿qué nivel de inglés tiene?');
    expect(service.messages()[1].content).toContain('B2');
  });

  it('should answer leadership and senior role questions', async () => {
    translation.setLanguage('es');
    await send('¿tiene experiencia liderando equipos o en arquitectura?');
    const content = service.messages()[1].content;
    expect(content).toContain('equipo');
    expect(['lidera', 'liderando', 'liderazgo'].some(word => content.includes(word))).toBe(true);
  });

  it('should keep the thread and answer about the previous company', async () => {
    translation.setLanguage('es');
    await send('cuéntame su trabajo en NTT DATA');
    await send('y anteriormente?');
    const content = service.messages()[3].content;
    expect(content).toContain('Deloitte');
    expect(content).toContain('09/2020');
  });

  it('should answer about the previous company without prior context', async () => {
    await send('where did he work before?');
    expect(service.messages()[1].content).toContain('Deloitte');
  });

  it('should answer tenure follow-ups using the last company', async () => {
    translation.setLanguage('es');
    await send('cuéntame sobre Deloitte');
    await send('¿cuánto tiempo estuvo?');
    const content = service.messages()[3].content;
    expect(content).toContain('Deloitte');
    expect(content).toContain('3 años y 10 meses');
  });

  it('should answer technologies follow-ups using the last company', async () => {
    translation.setLanguage('es');
    await send('háblame de Deloitte');
    await send('¿qué tecnologías usó?');
    expect(service.messages()[3].content).toContain('Deloitte');
    expect(service.messages()[3].content).toContain('Storybook');
  });

  it('should ask for clarification on gibberish input in spanish', async () => {
    translation.setLanguage('es');
    await send('asidasdhashb');
    const content = service.messages()[1].content;
    expect(['No he entendido', 'no he llegado'].some(phrase => content.includes(phrase))).toBe(true);
    expect(content).toContain('Manuel');
  });

  it('should ask for clarification on gibberish input in english', async () => {
    await send('qwertyuiop');
    const content = service.messages()[1].content;
    expect([
      "I didn't quite understand your question",
      'Sorry, I could not follow you'
    ].some(phrase => content.includes(phrase))).toBe(true);
  });

  it('should answer age question in english', async () => {
    await send('how old is he?');
    const content = service.messages()[1].content;
    expect(content).toContain('1999');
    expect(content).toMatch(/\d+ años?|\d+ years?/);
  });

  it('should answer age question in spanish', async () => {
    translation.setLanguage('es');
    await send('qué edad tiene?');
    expect(service.messages()[1].content).toContain('1999');
  });

  it('should answer personality in english', async () => {
    await send('what is he like? tell me his personality');
    const content = service.messages()[1].content;
    expect(['activa', 'proactiva', 'constante', 'metódico', 'apasionado', 'active', 'proactive', 'consistent', 'methodical', 'passionate'].some(word => content.toLowerCase().includes(word))).toBe(true);
  });

  it('should answer personality in spanish', async () => {
    translation.setLanguage('es');
    await send('cómo es manuel? personalidad');
    const content = service.messages()[1].content;
    expect(content).toContain('activa');
  });

  it('should answer goals in english', async () => {
    await send('what are his goals?');
    const content = service.messages()[1].content;
    expect(content).toContain('leadership');
  });

  it('should answer goals in spanish', async () => {
    translation.setLanguage('es');
    await send('cuáles son sus objetivos?');
    expect(service.messages()[1].content).toContain('liderazgo');
  });

  it('should not flag as off-topic when there is a protected topic hit', async () => {
    await send('angular is great');
    const content = service.messages()[1].content;
    expect(content).toContain('Angular');
  });

  it('should return a general answer for unrecognized input with context', async () => {
    await send('Tell me something about Manuel');
    const content = service.messages()[1].content;
    expect(content).toContain('Senior Frontend Engineer');
  });

  it('should handle follow-up about previous company after asking about current', async () => {
    await send('Tell me about NTT DATA');
    await send('and before that?');
    const content = service.messages()[3].content;
    expect(content).toContain('Deloitte');
  });

  it('should detect age intent and calculate age correctly', async () => {
    await send('how old is Manuel?');
    const content = service.messages()[1].content;
    expect(content).toMatch(/\d+ years? old/);
    expect(content).toContain('1999');
  });

  it('should answer off-topic response when no protected topic is hit', async () => {
    await send('what is the weather like?');
    const content = service.messages()[1].content.toLowerCase();
    expect(['career', 'scope', 'purpose'].some(word => content.includes(word))).toBe(true);
  });

  it('should answer company details follow-up with tech context', async () => {
    translation.setLanguage('es');
    await send('cuéntame sobre NTT DATA');
    await send('qué tecnologías usó allí?');
    const content = service.messages()[3].content;
    expect(content).toContain('NTT DATA');
  });

  it('should calculate age correctly when birthday has not occurred yet this year', () => {
    const calc = (service as any).calculateAge.bind(service);
    const beforeBirthday = new Date(2025, 0, 1);
    expect(calc('1999-04-23', beforeBirthday)).toBe(25);
  });

  it('should answer previous company query directly', async () => {
    await send('where did he work before?');
    expect(service.messages()[1].content).toContain('Deloitte');
  });

  it('should answer methodology with agile focus', async () => {
    await send('what is his work methodology? tell me about agile');
    const content = service.messages()[1].content.toLowerCase();
    expect(['agile', 'iterative', 'jest', 'tests'].some(word => content.includes(word))).toBe(true);
  });

  it('should answer hobbies with boxing and tennis details', async () => {
    await send('what are his hobbies?');
    const content = service.messages()[1].content;
    expect(['Boxing', 'Boxeo', 'Tennis', 'Tenis'].some(word => content.includes(word))).toBe(true);
  });

  it('should answer follow-up about previous company after context', async () => {
    await send('Tell me about NTT DATA');
    await send('y anteriormente?');
    const content = service.messages()[3].content;
    expect(content).toContain('Deloitte');
  });

  it('should answer company context query with responsibilities', async () => {
    await send('responsibilities at NTT DATA');
    expect(service.messages()[1].content).toContain('NTT DATA');
  });

  it('should call buildPreviousCompanyAnswer for previous company follow-up', async () => {
    await send('Tell me about NTT DATA');
    await send('before that?');
    const content = service.messages()[3].content;
    expect(content).toContain('Deloitte');
  });

  it('should call buildCompanyDetailsAnswer for company context query', async () => {
    (service as any).lastEntity = 'ntt';
    const answer = (service as any).buildCompanyDetailsAnswer('responsibilities', 'en');
    expect(answer).toContain('NTT DATA');
  });

  it('should pick random from scored roles when bestScore > 0', () => {
    const result = (service as any).pickRelevantRole('angular testing', 'en');
    expect(result).toBeTruthy();
    expect(result.company).toBeTruthy();
  });

  it('should call buildPreviousCompanyAnswer directly', () => {
    const answer = (service as any).buildPreviousCompanyAnswer('en');
    expect(answer).toContain('Deloitte');
  });

  it('should call buildCompanyDetailsAnswer with lastEntity set', () => {
    (service as any).lastEntity = 'ntt';
    const answer = (service as any).buildCompanyDetailsAnswer('tell me more about responsibilities', 'en');
    expect(answer).toContain('NTT DATA');
  });

  it('should trigger buildFollowUpAnswer with previous company query', async () => {
    await send('Tell me about NTT DATA');
    await send('anteriormente?');
    const content = service.messages()[3].content;
    expect(content).toContain('Deloitte');
  });

  it('should cover buildPreviousCompanyAnswer in buildFollowUpAnswer', () => {
    const answer = (service as any).buildFollowUpAnswer('anteriormente', 'en');
    expect(answer).toContain('Deloitte');
  });

  it('should cover buildCompanyDetailsAnswer in buildFollowUpAnswer', () => {
    (service as any).lastEntity = 'ntt';
    const answer = (service as any).buildFollowUpAnswer('responsibilities', 'en');
    expect(answer).toContain('NTT DATA');
  });

  it('should cover the default case with random true branch', () => {
    const mathRandom = Math.random;
    Math.random = jest.fn().mockReturnValue(0.9);
    const answer = (service as any).buildIntentAnswer('general', 'some random query', 'en');
    expect(answer).toContain('Senior Frontend Engineer');
    Math.random = mathRandom;
  });
});
 
