const fs = require('fs');

const part1 = `import { computed, inject, Injectable, InjectionToken, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MANUEL_CV_DATA } from '../core/data/cv-data';
import { useTranslation } from './translation.service';

export interface ManiaMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const MANIA_API_KEY = new InjectionToken<string>('MANIA_API_KEY', {
  factory: () => ''
});

const MANIA_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

const OFF_TOPIC_RESPONSES_ES = [
  'Solo puedo responder preguntas sobre la trayectoria profesional, stack tecnico y experiencia de Manuel Alba.',
  'Mi conocimiento esta limitado a la carrera profesional de Manuel Alba. Preguntame sobre su experiencia.',
  'Estoy disenado exclusivamente para hablar sobre Manuel Alba.'
];

const OFF_TOPIC_RESPONSES_EN = [
  'I can only answer questions about Manuel Alba\\'s professional career, technical stack, and experience.',
  'My knowledge is limited to Manuel Alba\\'s professional background.',
  'I am designed exclusively to discuss Manuel Alba.'
];

@Injectable({ providedIn: 'root' })
export class ManiaChatService {
  private readonly http = inject(HttpClient);
  private readonly apiKey = inject(MANIA_API_KEY);
  private readonly translation = useTranslation();

  readonly messages = signal<ManiaMessage[]>([]);
  readonly isLoading = signal(false);

  readonly hasMessages = computed(() => this.messages().length > 0);

  async sendMessage(content: string): Promise<void> {
    const trimmed = content.trim();
    if (!trimmed || this.isLoading()) {
      return;
    }

    this.messages.update(list => [...list, { role: 'user', content: trimmed }]);
    this.isLoading.set(true);

    try {
      const lang = this.translation.language();
      const reply = await this.generateDynamicResponse(trimmed, lang);
      this.appendAssistant(reply);
    } catch {
      this.messages.update(list => list.filter(m => m.role === 'user'));
      this.isLoading.set(false);
      throw new Error('MANIA_REQUEST_FAILED');
    }
  }

  reset(): void {
    this.messages.set([]);
    this.isLoading.set(false);
  }

  private appendAssistant(reply: string): void {
    this.messages.update(list => [...list, { role: 'assistant', content: reply }]);
    this.isLoading.set(false);
  }

  private async generateDynamicResponse(query: string, lang: 'es' | 'en'): Promise<string> {
    const normalizedQuery = query.toLowerCase();

    if (!this.isOnTopic(normalizedQuery)) {
      return this.getOffTopicResponse(lang);
    }

    if (this.apiKey) {
      return this.requestLlmCompletion(query, lang);
    }

    return this.simulateClientSideResponse(normalizedQuery, lang);
  }

  private isOnTopic(query: string): boolean {
    const topicKeywords = [
      'experience', 'cv', 'resume', 'stack', 'angular', 'typescript', 'rxjs', 'signals',
      'frontend', 'engineer', 'architecture', 'refactor', 'testing', 'jest', 'karma',
      'jasmine', 'javascript', 'html', 'css', 'tailwind', 'git', 'agile', 'scrum',
      'banking', 'insurance', 'fintech', 'investment', 'legacy', 'migration', 'coverage',
      'manuel', 'alba', 'manolo', 'manu', 'developer', 'career', 'work',
      'job', 'professional', 'skill', 'technology', 'project', 'team', 'lead', 'senior',
      'educacion', 'universidad', 'titulacion', 'experiencia', 'trabajo', 'tecnologia',
      'proyecto', 'equipo', 'lider', 'contacto', 'email', 'telefono', 'correo', 'linkedin',
      'certificacion', 'certificado', 'formacion', 'degree', 'university', 'study',
      'highlight', 'achievement', 'accomplishment', 'logro', 'hito', 'destacado',
      'contact', 'phone', 'education', 'certification', 'certificate'
    ];

    return topicKeywords.some(keyword => query.includes(keyword));
  }

  private getOffTopicResponse(lang: 'es' | 'en'): string {
    const responses = lang === 'es' ? OFF_TOPIC_RESPONSES_ES : OFF_TOPIC_RESPONSES_EN;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private async requestLlmCompletion(query: string, lang: 'es' | 'en'): Promise<string> {
    const systemContext = this.buildSystemContext(lang);
    const conversationHistory = this.messages().map(m => ({ role: m.role, content: m.content }));

    const response = await firstValueFrom(
      this.http.post<{ choices: { message: { content: string } }[] }>(
        MANIA_API_ENDPOINT,
        {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemContext },
            ...conversationHistory
          ],
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': \`Bearer \${this.apiKey}\`,
            'Content-Type': 'application/json'
          }
        }
      )
    );

    return response.choices[0].message.content;
  }
`;

fs.writeFileSync('src/app/services/mania-chat.service.ts', part1, 'utf8');
console.log('Part 1 written');
`;