import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TranslationService } from './translation.service';
import { MANUEL_CV_DATA } from '../core/data/cv-data';

export interface ManiaMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const MANIA_API_KEY = '';

const OFF_TOPIC_RESPONSES: Record<'es' | 'en', string[]> = {
  es: [
    'Solo puedo responder preguntas sobre la trayectoria, experiencia y stack de Manuel Alba. Pruebe a preguntarme sobre su trabajo con Angular o testing.',
    'Lo siento, mi ámbito se limita a la carrera profesional de Manuel Alba: experiencia, proyectos, stack técnico y formación.',
    'Esa consulta está fuera de mi propósito. Estoy diseñado exclusivamente para hablar del perfil profesional de Manuel Alba.'
  ],
  en: [
    'I can only answer questions about Manuel Alba\'s career, experience and stack. Try asking me about his work with Angular or testing.',
    'I am sorry, my scope is limited to Manuel Alba\'s professional career: experience, projects, technical stack and education.',
    'That request is outside my purpose. I am designed exclusively to discuss Manuel Alba\'s professional profile.'
  ]
};

type Intent = 'role' | 'experience' | 'testing' | 'stack' | 'projects' | 'education' | 'contact' | 'general';

const INTENT_KEYWORDS: Record<Intent, string[]> = {
  role: ['puesto', 'cargo', 'rango', 'rol', 'position', 'role', 'title', 'rank', 'job'],
  experience: ['experiencia', 'trayectoria', 'carrera', 'logros', 'hitos', 'experience', 'career', 'achievements', 'milestones'],
  testing: ['testing', 'tests', 'test', 'jest', 'karma', 'jasmine', 'cobertura', 'coverage', 'pruebas', 'unittest'],
  stack: ['stack', 'tecnologias', 'tecnologia', 'lenguajes', 'framework', 'skills', 'technologies', 'tools', 'herramientas'],
  projects: ['proyecto', 'proyectos', 'projects', 'portfolio', 'aplicaciones', 'apps'],
  education: ['formacion', 'estudios', 'educacion', 'education', 'degree', 'titulo', 'certificacion', 'certifications'],
  contact: ['contacto', 'contact', 'email', 'correo', 'telefono', 'phone', 'linkedin', 'localizacion', 'location'],
  general: ['quien', 'perfil', 'profile', 'sobre', 'about', 'resume', 'presentate']
};

const OFF_TOPIC_TERMS = ['chiste', 'joke', 'receta', 'recipe', 'tiempo', 'weather', 'futbol', 'football', 'soccer', 'cocina', 'cooking', 'pelicula', 'movie', 'musica', 'music', 'clima', 'tiempolibre', 'hobby', 'hobbies', 'juego', 'game'];

const FOLLOW_UP_TERMS = ['actualmente', 'ahora', 'donde', 'cuando', 'cuales', 'cual', 'quien', 'mas', 'cuentame', 'dime', 'sigue', 'expande', 'algo', 'saber', 'debo', 'detalles', 'sobre', 'currently', 'where', 'when', 'which', 'more', 'info', 'tell', 'continue', 'else', 'should', 'know', 'background', 'details', 'ones'];

const FOLLOW_UP_PHRASES = [
  'y que mas', 'que mas', 'algo mas', 'algo mas que deba saber', 'cuentame mas', 'dime mas', 'y actualmente', 'mas detalles', 'sobre su experiencia', 'y su experiencia',
  'and what else', 'what else', 'anything else', 'what else should i know', 'tell me more', 'and currently', 'which ones', 'what about his background', 'more details', 'more info'
];

@Injectable({ providedIn: 'root' })
export class ManiaChatService {
  private static apiKeyOverride: string | null = null;

  private readonly http = inject(HttpClient);
  private readonly translation = inject(TranslationService);

  readonly messages = signal<ManiaMessage[]>([]);
  readonly isLoading = signal(false);
  readonly hasMessages = computed(() => this.messages().length > 0);
  private readonly usedFacts = new Set<string>();

  static setApiKeyOverride(value: string | null): void {
    ManiaChatService.apiKeyOverride = value;
  }

  async sendMessage(content: string): Promise<void> {
    const trimmed = content.trim();
    if (!trimmed || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.messages.update(m => [...m, { role: 'user', content: trimmed }]);

    try {
      const currentLang = this.translation.language() === 'es' ? 'es' : 'en';
      const response = await this.generateDynamicResponse(trimmed, currentLang);
      this.messages.update(m => [...m, { role: 'assistant', content: response }]);
    } finally {
      this.isLoading.set(false);
    }
  }

  reset(): void {
    this.messages.set([]);
    this.isLoading.set(false);
    this.usedFacts.clear();
  }

  async generateDynamicResponse(userQuery: string, lang: 'es' | 'en'): Promise<string> {
    const normalized = userQuery.toLowerCase();
    const apiKey = ManiaChatService.apiKeyOverride ?? MANIA_API_KEY;

    if (apiKey) {
      try {
        return await this.requestCompletion(userQuery, lang);
      } catch {
        return this.simulateClientSideResponse(normalized, lang);
      }
    }

    return this.simulateClientSideResponse(normalized, lang);
  }

  private requestCompletion(userQuery: string, lang: 'es' | 'en'): Promise<string> {
    const apiKey = ManiaChatService.apiKeyOverride ?? MANIA_API_KEY;
    const systemPrompt = this.buildSystemPrompt(lang);
    return firstValueFrom(
      this.http.post<{ choices?: { message?: { content?: string } }[] }>(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...this.messages().map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userQuery }
          ],
          temperature: 0.7
        },
        { headers: new HttpHeaders({ Authorization: `Bearer ${apiKey}` }) }
      ).pipe(delay(1000))
    ).then(res => {
      const content = res.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('Empty completion');
      }
      return content;
    });
  }

  private buildSystemPrompt(lang: 'es' | 'en'): string {
    const cv = MANUEL_CV_DATA;
    const facts = [
      `${cv.name} (${cv.title[lang]})`,
      `Stack: ${cv.stack.join(', ')}`,
      `Achievements: ${[...cv.highlights.map(h => h[lang]), ...cv.experience.flatMap(e => e.achievements.map(a => a[lang]))].join(' | ')}`,
      `Experience: ${cv.experience.map(e => `${e.title[lang]} at ${e.company} (${e.period[lang]})`).join(' | ')}`
    ].join('\n');

    return lang === 'es'
      ? `Eres ManIA, asistente virtual. Solo respondes sobre la carrera de ${cv.name}. Responde siempre en español.\n${facts}`
      : `You are ManIA, a virtual assistant. You only answer about ${cv.name}'s career. Always answer in English.\n${facts}`;
  }

  private async simulateClientSideResponse(normalizedQuery: string, lang: 'es' | 'en'): Promise<string> {
    await this.delay(1000);

    const related = this.isRelatedToManuel(normalizedQuery);
    if (!related) {
      if (this.isFollowUpInContext(normalizedQuery)) {
        return this.buildFollowUpAnswer(normalizedQuery, lang);
      }
      return this.pickRandom(OFF_TOPIC_RESPONSES[lang]);
    }

    return this.composeDynamicAnswer(normalizedQuery, lang);
  }

  private isFollowUpInContext(query: string): boolean {
    if (this.messages().length <= 1) {
      return false;
    }

    const normalized = this.normalizeText(query);
    if (FOLLOW_UP_PHRASES.some(phrase => normalized.includes(phrase))) {
      return true;
    }

    const tokens = this.tokenize(query);
    if (tokens.length === 0 || tokens.length > 4) {
      return false;
    }

    return FOLLOW_UP_TERMS.some(term =>
      tokens.some(token => this.stemsMatch(token, term))
    );
  }

  private buildFollowUpAnswer(query: string, lang: 'es' | 'en'): string {
    const intent = this.detectIntent(query);
    if (intent !== 'general') {
      return this.buildIntentAnswer(intent, query, lang);
    }

    if (this.isRoleFollowUp(query)) {
      return this.buildCurrentRoleAnswer(lang);
    }

    const fact = this.pickUnshownFact(lang);
    return fact[lang];
  }

  private isRoleFollowUp(query: string): boolean {
    const normalized = this.normalizeText(query);
    return (
      normalized.includes('actualmente') ||
      normalized.includes('currently') ||
      normalized.includes('donde trabaja') ||
      normalized.includes('where does he work')
    );
  }

  private buildCurrentRoleAnswer(lang: 'es' | 'en'): string {
    const role = MANUEL_CV_DATA.experience[0];
    return lang === 'es'
      ? `Actualmente se desempeña como ${role.title.es} en ${role.company} (${role.period.es}).`
      : `He currently works as a ${role.title.en} at ${role.company} (${role.period.en}).`;
  }

  private pickUnshownFact(lang: 'es' | 'en'): { es: string; en: string } {
    const cv = MANUEL_CV_DATA;
    const cert = cv.certifications[0];
    const pool = [
      cv.highlights[0],
      cv.highlights[1],
      cv.highlights[2],
      cv.highlights[3],
      {
        es: `Posee la ${cert.name.es}, con verificación oficial disponible en línea.`,
        en: `He holds the ${cert.name.en}, with official online verification available.`
      }
    ];

    const fresh = pool.filter(fact => !this.usedFacts.has(fact[lang]));
    if (fresh.length > 0) {
      const fact = this.pickRandom(fresh);
      this.usedFacts.add(fact[lang]);
      return fact;
    }

    this.usedFacts.clear();
    const fact = this.pickRandom(pool);
    this.usedFacts.add(fact[lang]);
    return fact;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private normalizeText(text: string): string {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  private tokenize(query: string): string[] {
    return this.normalizeText(query).split(/[^a-z0-9+#.]+/).filter(Boolean);
  }

  private isRelatedToManuel(query: string): boolean {
    const tokens = this.tokenize(query);
    if (tokens.length === 0) {
      return false;
    }

    const aliases = [...MANUEL_CV_DATA.aliases.es, ...MANUEL_CV_DATA.aliases.en]
      .filter(alias => alias.trim().length >= 3);
    const aliasHits = aliases.some(alias =>
      tokens.some(token => this.stemsMatch(token, this.normalizeText(alias)))
    );

    const vocabulary = this.getCareerVocabulary();
    const topicHits = vocabulary.some(term =>
      tokens.some(token => this.stemsMatch(token, term))
    );

    const offTopicHits = OFF_TOPIC_TERMS.some(term =>
      tokens.some(token => this.stemsMatch(token, term))
    );

    if (offTopicHits) {
      return false;
    }

    return aliasHits || topicHits;
  }

  private getCareerVocabulary(): string[] {
    const cv = MANUEL_CV_DATA;
    const stackTerms = cv.stack.flatMap(t => this.tokenize(t));
    const techTerms = cv.experience.flatMap(e => e.technologies).flatMap(t => this.tokenize(t));
    const companyTerms = cv.experience.map(e => this.normalizeText(e.company));
    const intentTerms = Object.values(INTENT_KEYWORDS).flat();

    return [...new Set([...stackTerms, ...techTerms, ...companyTerms, ...intentTerms])].filter(Boolean);
  }

  private detectIntent(query: string): Intent {
    const tokens = this.tokenize(query);
    const intents = Object.keys(INTENT_KEYWORDS) as Intent[];

    for (const intent of intents) {
      const hits = INTENT_KEYWORDS[intent].some(keyword =>
        tokens.some(token => this.stemsMatch(token, keyword))
      );
      if (hits) {
        return intent;
      }
    }

    return 'general';
  }

  private stemsMatch(token: string, term: string): boolean {
    if (token === term) {
      return true;
    }
    const minStem = Math.min(4, Math.max(3, Math.floor(term.length * 0.6)));
    const tokenStem = token.slice(0, minStem);
    if (tokenStem.length < 3) {
      return false;
    }
    return term.startsWith(tokenStem) || token.startsWith(term.slice(0, minStem));
  }

  private composeDynamicAnswer(query: string, lang: 'es' | 'en'): string {
    const intent = this.detectIntent(query);
    return this.buildIntentAnswer(intent, query, lang);
  }

  private buildIntentAnswer(intent: Intent, query: string, lang: 'es' | 'en'): string {
    const cv = MANUEL_CV_DATA;

    switch (intent) {
      case 'role': {
        const templates = lang === 'es'
          ? [`Su puesto actual es ${cv.title.es}.`, `Manuel trabaja como ${cv.title.es}.`, `Actualmente ejerce como ${cv.title.es}.`]
          : [`His current role is ${cv.title.en}.`, `Manuel works as a ${cv.title.en}.`, `He currently serves as a ${cv.title.en}.`];
        return this.pickRandom(templates);
      }
      case 'experience': {
        const role = this.pickRelevantRole(query, lang);
        return lang === 'es'
          ? `${role.title.es} en ${role.company} (${role.period.es}). ${role.description.es}`
          : `${role.title.en} at ${role.company} (${role.period.en}). ${role.description.en}`;
      }
      case 'testing': {
        const fact = cv.highlights[1];
        return lang === 'es' ? fact.es : fact.en;
      }
      case 'stack':
        return lang === 'es'
          ? `Su stack principal incluye ${cv.stack.join(', ')}.`
          : `His main stack includes ${cv.stack.join(', ')}.`;
      case 'projects': {
        const project = this.pickRandom(cv.projects);
        return lang === 'es'
          ? `${project.name.es} (${project.company}): ${project.description.es}`
          : `${project.name.en} (${project.company}): ${project.description.en}`;
      }
      case 'education': {
        const degree = cv.education[0];
        const cert = cv.certifications[0];
        return lang === 'es'
          ? `Se formó como ${degree.degree.es} en ${degree.institution} (${degree.period}). Además, posee la ${cert.name.es}.`
          : `He studied ${degree.degree.en} at ${degree.institution} (${degree.period}). He also holds the ${cert.name.en}.`;
      }
      case 'contact':
        return lang === 'es'
          ? `Puedes contactar con Manuel en ${cv.contact.email} o a través de su LinkedIn (${cv.contact.linkedin}). Reside en ${cv.contact.location.es}.`
          : `You can reach Manuel at ${cv.contact.email} or through his LinkedIn (${cv.contact.linkedin}). He is based in ${cv.contact.location.en}.`;
      default: {
        const highlight = this.pickRandom(cv.highlights);
        return lang === 'es'
          ? `${cv.summary.es} Entre sus hitos: ${highlight.es}.`
          : `${cv.summary.en} Among his milestones: ${highlight.en}.`;
      }
    }
  }

  private pickRelevantRole(query: string, lang: 'es' | 'en') {
    const cv = MANUEL_CV_DATA;
    const queryTokens = new Set(this.tokenize(query));
    const scored = cv.experience.map(role => {
      const factTokens = this.tokenize(
        [role.company, role.title[lang], role.description[lang], ...role.technologies].join(' ')
      );
      const score = factTokens.reduce((acc, t) => acc + (queryTokens.has(t) ? 1 : 0), 0);
      return { role, score };
    });

    const bestScore = Math.max(...scored.map(s => s.score));
    if (bestScore === 0) {
      return this.pickRandom(cv.experience);
    }

    return this.pickRandom(scored.filter(s => s.score === bestScore)).role;
  }

  private pickRandom<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }
}
