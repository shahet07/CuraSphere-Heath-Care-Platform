import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AIInsightsRequest, AIInsightsResponse } from 'src/app/models/ai';
import { AiService } from 'src/app/services/ai.service';

type ChatActionType = 'route' | 'book' | 'preset' | 'start' | 'skip';
type IntakeStage =
  | 'name'
  | 'email'
  | 'age'
  | 'gender'
  | 'symptoms'
  | 'conditions'
  | 'allergies'
  | 'medicines'
  | 'specialization'
  | 'preferredDate'
  | null;

interface ChatAction {
  label: string;
  type: ChatActionType;
  value: string;
}

interface ChatMessage {
  sender: 'assistant' | 'user';
  text: string;
  timestamp: Date;
  actions?: ChatAction[];
}

interface ChatIntakeProfile {
  patientName: string;
  email: string;
  age: string;
  gender: string;
  symptomNarrative: string;
  chronicConditions: string;
  allergies: string;
  currentMedicines: string;
  specializationPreference: string;
  preferredDate: string;
}

@Component({
  selector: 'app-chatbotwidget',
  templateUrl: './chatbotwidget.component.html',
  styleUrls: ['./chatbotwidget.component.css']
})
export class ChatbotwidgetComponent implements OnInit {
  isOpen = false;
  isLoading = false;
  input = '';
  currentPageLabel = 'welcome';
  currentStage: IntakeStage = null;
  lastInsights?: AIInsightsResponse;
  pendingConcern = '';
  optionalStageAnswered = {
    conditions: false,
    allergies: false,
    medicines: false,
    specialization: false,
    preferredDate: false
  };

  quickPrompts = [
    'Hi, can you help me today?',
    'I need help booking an appointment',
    'I want you to assess my symptoms',
    'What should I do next for urgent care?'
  ];

  intakeProfile: ChatIntakeProfile = {
    patientName: '',
    email: '',
    age: '',
    gender: '',
    symptomNarrative: '',
    chronicConditions: '',
    allergies: '',
    currentMedicines: '',
    specializationPreference: '',
    preferredDate: ''
  };

  messages: ChatMessage[] = [];

  constructor(private aiService: AiService, private router: Router) {}

  ngOnInit(): void {
    this.hydrateProfileFromSession();
    this.seedWelcomeMessage();
    this.updateRouteContext(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateRouteContext(event.urlAfterRedirects || event.url || '/');
      });
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  askQuickPrompt(prompt: string): void {
    this.input = prompt;
    this.sendMessage();
  }

  sendMessage(): void {
    const content = (this.input || '').trim();
    if (!content || this.isLoading) {
      return;
    }

    this.pushUserMessage(content);
    this.input = '';

    if (this.currentStage) {
      this.handleIntakeAnswer(content);
      return;
    }

    if (this.isSmallTalk(content)) {
      this.pushAssistantMessage(
        'Hi there. I am glad you opened the live care assistant. I can chat a little, but for accurate prediction I will first collect your personal and symptom details one step at a time.',
        [
          { label: 'Start Health Assessment', type: 'start', value: 'start' },
          { label: 'Open Full AI Assistant', type: 'route', value: '/aiassistant' }
        ]
      );
      return;
    }

    this.startAssessment(content);
  }

  handleAction(action: ChatAction): void {
    if (action.type === 'route') {
      this.router.navigate([action.value]);
      this.isOpen = false;
      return;
    }

    if (action.type === 'preset') {
      this.input = action.value;
      this.sendMessage();
      return;
    }

    if (action.type === 'start') {
      this.startAssessment('');
      return;
    }

    if (action.type === 'skip') {
      this.handleIntakeAnswer('skip');
      return;
    }

    if (action.type === 'book' && this.lastInsights) {
      const role = (sessionStorage.getItem('ROLE') || '').replace(/"/g, '').toLowerCase();
      if (role !== 'user') {
        this.pushAssistantMessage(
          'Booking works best from a patient account. Please log in as a user, or open the booking page manually to review the recommendation.',
          [
            { label: 'Open Login', type: 'route', value: '/login' },
            { label: 'Open Booking Page', type: 'route', value: '/bookappointment' }
          ]
        );
        return;
      }

      const doctor = this.lastInsights.doctorRecommendation?.doctors?.[0];
      const slot = this.lastInsights.slotRecommendation;

      this.router.navigate(['/bookappointment'], {
        queryParams: {
          patientname: this.intakeProfile.patientName || this.getDisplayName(),
          email: this.intakeProfile.email || this.getEmail(),
          gender: this.intakeProfile.gender || this.getGender(),
          age: this.intakeProfile.age || this.getAge(),
          doctorname: slot?.recommendedDoctor || doctor?.doctorname || '',
          specialization:
            slot?.recommendedSpecialization ||
            this.lastInsights.doctorRecommendation.recommendedSpecialization ||
            this.intakeProfile.specializationPreference,
          problem: this.lastInsights.diseasePrediction.probableCondition,
          date: slot?.recommendedDate || this.intakeProfile.preferredDate || '',
          slot: slot?.recommendedSlot || '',
          aiUrgency: this.lastInsights.triageChat.urgency,
          aiCondition: this.lastInsights.diseasePrediction.probableCondition
        }
      });
      this.isOpen = false;
    }
  }

  private startAssessment(initialMessage: string): void {
    if (initialMessage && !this.isGenericIntent(initialMessage)) {
      this.pendingConcern = initialMessage;
    }

    this.pushAssistantMessage(
      'Let us do this properly. I will ask a few quick questions, collect your personal details, and then I will generate the predicted output for you.',
      []
    );

    this.currentStage = this.getNextStage();
    this.askForCurrentStage();
  }

  private handleIntakeAnswer(answer: string): void {
    const normalized = answer.trim();
    const lower = normalized.toLowerCase();

    if (!this.currentStage) {
      return;
    }

    switch (this.currentStage) {
      case 'name':
        if (!normalized) {
          this.askForCurrentStage();
          return;
        }
        this.intakeProfile.patientName = normalized;
        break;
      case 'email':
        if (!this.isSkip(lower) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
          this.pushAssistantMessage('Please enter a valid email address, or type "skip" if you want to continue without it.', [
            { label: 'Skip Email', type: 'skip', value: 'skip' }
          ]);
          return;
        }
        this.intakeProfile.email = this.isSkip(lower) ? '' : normalized;
        break;
      case 'age':
        if (!this.isSkip(lower) && (!/^\d+$/.test(normalized) || Number(normalized) < 1 || Number(normalized) > 120)) {
          this.pushAssistantMessage('Please enter age as a number between 1 and 120, or type "skip".', [
            { label: 'Skip Age', type: 'skip', value: 'skip' }
          ]);
          return;
        }
        this.intakeProfile.age = this.isSkip(lower) ? '' : normalized;
        break;
      case 'gender':
        this.intakeProfile.gender = this.isSkip(lower) ? '' : this.normalizeGender(normalized);
        break;
      case 'symptoms':
        if (this.isSkip(lower) && this.pendingConcern) {
          this.intakeProfile.symptomNarrative = this.pendingConcern;
        } else if (this.isSkip(lower)) {
          this.pushAssistantMessage('I need at least a short symptom description before I can predict anything. Tell me what you are feeling in your own words.');
          return;
        } else {
          this.intakeProfile.symptomNarrative = normalized;
        }
        break;
      case 'conditions':
        this.intakeProfile.chronicConditions = this.isSkip(lower) ? '' : normalized;
        this.optionalStageAnswered.conditions = true;
        break;
      case 'allergies':
        this.intakeProfile.allergies = this.isSkip(lower) ? '' : normalized;
        this.optionalStageAnswered.allergies = true;
        break;
      case 'medicines':
        this.intakeProfile.currentMedicines = this.isSkip(lower) ? '' : normalized;
        this.optionalStageAnswered.medicines = true;
        break;
      case 'specialization':
        this.intakeProfile.specializationPreference = this.isSkip(lower) ? '' : normalized;
        this.optionalStageAnswered.specialization = true;
        break;
      case 'preferredDate':
        this.intakeProfile.preferredDate = this.normalizeDateValue(normalized, lower);
        this.optionalStageAnswered.preferredDate = true;
        break;
    }

    this.currentStage = this.getNextStage();

    if (!this.currentStage) {
      this.generateAssessment();
      return;
    }

    this.askForCurrentStage();
  }

  private askForCurrentStage(): void {
    switch (this.currentStage) {
      case 'name':
        this.pushAssistantMessage('First, what should I call you?', []);
        break;
      case 'email':
        this.pushAssistantMessage('What is the best email for your care record? You can also type "skip".', [
          { label: 'Skip Email', type: 'skip', value: 'skip' }
        ]);
        break;
      case 'age':
        this.pushAssistantMessage('How old are you?', [
          { label: 'Skip Age', type: 'skip', value: 'skip' }
        ]);
        break;
      case 'gender':
        this.pushAssistantMessage('What gender should I record for this assessment?', [
          { label: 'Male', type: 'preset', value: 'Male' },
          { label: 'Female', type: 'preset', value: 'Female' },
          { label: 'Skip', type: 'skip', value: 'skip' }
        ]);
        break;
      case 'symptoms':
        this.pushAssistantMessage(
          this.pendingConcern
            ? `You already mentioned: "${this.pendingConcern}". If that fully describes the problem, type "skip". Otherwise, tell me more about the symptoms in your own words.`
            : 'Now tell me your symptoms in your own words. The more specific you are, the better the prediction will be.',
          this.pendingConcern ? [{ label: 'Use What I Already Said', type: 'skip', value: 'skip' }] : []
        );
        break;
      case 'conditions':
        this.pushAssistantMessage('Do you have any chronic conditions such as diabetes, asthma, hypertension, thyroid issues, or migraine history? Type "skip" if none.', [
          { label: 'Skip Conditions', type: 'skip', value: 'skip' }
        ]);
        break;
      case 'allergies':
        this.pushAssistantMessage('Do you have any allergies to food, dust, pollen, or medicines? Type "skip" if none.', [
          { label: 'Skip Allergies', type: 'skip', value: 'skip' }
        ]);
        break;
      case 'medicines':
        this.pushAssistantMessage('Are you taking any medicines right now? Type the names, or type "skip".', [
          { label: 'Skip Medicines', type: 'skip', value: 'skip' }
        ]);
        break;
      case 'specialization':
        this.pushAssistantMessage('Do you already want a certain specialist, or should I decide based on your symptoms? Type "skip" if you want me to decide.', [
          { label: 'Let AI Decide', type: 'skip', value: 'skip' }
        ]);
        break;
      case 'preferredDate':
        this.pushAssistantMessage('If you want booking guidance too, tell me your preferred appointment date in YYYY-MM-DD format. You can also type "today", "tomorrow", or "skip".', [
          { label: 'Skip Date', type: 'skip', value: 'skip' }
        ]);
        break;
    }
  }

  private generateAssessment(): void {
    this.isLoading = true;
    const request = this.buildRequest();

    this.aiService.generateInsights(request).subscribe({
      next: data => {
        this.lastInsights = data;
        this.isLoading = false;
        this.pushAssistantMessage(this.buildAssistantSummary(data), this.buildActions(data));
      },
      error: err => {
        this.isLoading = false;
        this.pushAssistantMessage(this.resolveChatError(err), [
          { label: 'Open Full AI Assistant', type: 'route', value: '/aiassistant' }
        ]);
      }
    });
  }

  private buildRequest(): AIInsightsRequest {
    const today = new Date().toISOString().slice(0, 10);
    return {
      patientName: this.intakeProfile.patientName || this.getDisplayName(),
      email: this.intakeProfile.email || this.getEmail(),
      gender: this.intakeProfile.gender || this.getGender(),
      specializationPreference: this.intakeProfile.specializationPreference,
      question: this.pendingConcern || this.intakeProfile.symptomNarrative || 'Please assess my symptoms and guide me.',
      symptomNarrative: this.intakeProfile.symptomNarrative || this.pendingConcern,
      reportText: `Live chat intake from ${this.currentPageLabel}. Collected via conversational assistant.`,
      preferredDate: this.intakeProfile.preferredDate || today,
      age: Number(this.intakeProfile.age || this.getAge() || 30),
      temperature: 98.6,
      bmi: 24,
      distanceKm: 5,
      missedAppointments: 0,
      leadTimeDays: 2,
      stressLevel: 4,
      sleepHours: 7,
      painLevel: 3,
      smoker: false,
      alcoholUse: false,
      familyHistory: false,
      hasReminder: true,
      weekendAppointment: false,
      symptoms: this.toList(this.intakeProfile.symptomNarrative),
      chronicConditions: this.toList(this.intakeProfile.chronicConditions),
      allergies: this.toList(this.intakeProfile.allergies),
      currentMedicines: this.toList(this.intakeProfile.currentMedicines)
    };
  }

  private buildAssistantSummary(data: AIInsightsResponse): string {
    const doctor = data.doctorRecommendation?.doctors?.[0];
    const slot = data.slotRecommendation;
    const doctorLine = doctor
      ? `The strongest doctor match is ${doctor.doctorname} in ${doctor.specialization}. `
      : `The recommended specialty is ${data.doctorRecommendation.recommendedSpecialization}. `;
    const slotLine = slot?.recommendedSlot
      ? `Best booking option looks like ${slot.recommendedDate} ${slot.recommendedSlot}. `
      : '';

    return (
      `Thanks, ${this.intakeProfile.patientName || this.getDisplayName()}. Based on the information you shared, the predicted condition is ${data.diseasePrediction.probableCondition}. ` +
      `Urgency is ${data.triageChat.urgency}. ` +
      `${doctorLine}` +
      `${slotLine}` +
      `${data.triageChat.response}`
    );
  }

  private buildActions(data: AIInsightsResponse): ChatAction[] {
    const actions: ChatAction[] = [
      { label: 'Open Full AI Assistant', type: 'route', value: '/aiassistant' },
      { label: 'New Assessment', type: 'start', value: 'restart' }
    ];

    if ((sessionStorage.getItem('ROLE') || '').replace(/"/g, '').toLowerCase() === 'user') {
      actions.push({ label: 'Book Suggested Appointment', type: 'book', value: 'book' });
    }

    if (data.triageChat?.followUpQuestions?.[0]) {
      actions.push({
        label: 'Ask Follow-Up',
        type: 'preset',
        value: data.triageChat.followUpQuestions[0]
      });
    }

    this.resetIntakeAfterPrediction();
    return actions;
  }

  private seedWelcomeMessage(): void {
    this.messages = [
      {
        sender: 'assistant',
        text:
          'Hi. I am your live care assistant. I am available on every page, I can chat a little, and when you are ready I will collect your personal details and symptom history before giving a prediction.',
        timestamp: new Date(),
        actions: [
          { label: 'Start Health Assessment', type: 'start', value: 'start' },
          { label: 'Book Appointment Help', type: 'preset', value: 'I need help booking an appointment' },
          { label: 'Open Full AI Page', type: 'route', value: '/aiassistant' }
        ]
      }
    ];
  }

  private resetIntakeAfterPrediction(): void {
    this.currentStage = null;
    this.pendingConcern = '';
    this.intakeProfile.symptomNarrative = '';
    this.intakeProfile.chronicConditions = '';
    this.intakeProfile.allergies = '';
    this.intakeProfile.currentMedicines = '';
    this.intakeProfile.specializationPreference = '';
    this.intakeProfile.preferredDate = '';
    this.optionalStageAnswered = {
      conditions: false,
      allergies: false,
      medicines: false,
      specialization: false,
      preferredDate: false
    };
  }

  private hydrateProfileFromSession(): void {
    const displayName = this.getDisplayName();
    const email = this.getEmail();
    const gender = this.getGender();
    const age = this.getAge();

    this.intakeProfile.patientName = displayName === 'Guest Patient' ? '' : displayName;
    this.intakeProfile.email = email === 'guest@smartcare.ai' ? '' : email;
    this.intakeProfile.gender = gender || '';
    this.intakeProfile.age = age || '';
  }

  private getNextStage(): IntakeStage {
    if (!this.hasMeaningfulValue(this.intakeProfile.patientName)) {
      return 'name';
    }
    if (!this.hasMeaningfulValue(this.intakeProfile.email)) {
      return 'email';
    }
    if (!this.hasMeaningfulValue(this.intakeProfile.age)) {
      return 'age';
    }
    if (!this.hasMeaningfulValue(this.intakeProfile.gender)) {
      return 'gender';
    }
    if (!this.hasMeaningfulValue(this.intakeProfile.symptomNarrative) && !this.hasMeaningfulValue(this.pendingConcern)) {
      return 'symptoms';
    }
    if (!this.optionalStageAnswered.conditions) {
      return 'conditions';
    }
    if (!this.optionalStageAnswered.allergies) {
      return 'allergies';
    }
    if (!this.optionalStageAnswered.medicines) {
      return 'medicines';
    }
    if (!this.optionalStageAnswered.specialization) {
      return 'specialization';
    }
    if (!this.optionalStageAnswered.preferredDate) {
      return 'preferredDate';
    }
    return null;
  }

  private hasMeaningfulValue(value: string): boolean {
    return !!(value || '').trim();
  }

  private normalizeGender(value: string): string {
    const lower = value.toLowerCase();
    if (lower.includes('male')) {
      return 'Male';
    }
    if (lower.includes('female')) {
      return 'Female';
    }
    return value;
  }

  private normalizeDateValue(original: string, lower: string): string {
    if (this.isSkip(lower)) {
      return '';
    }

    if (lower === 'today') {
      return new Date().toISOString().slice(0, 10);
    }

    if (lower === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().slice(0, 10);
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(original)) {
      return original;
    }

    return '';
  }

  private isSkip(value: string): boolean {
    return value === 'skip' || value === 'none' || value === 'no';
  }

  private isSmallTalk(value: string): boolean {
    const lower = value.toLowerCase();
    return (
      lower === 'hi' ||
      lower === 'hello' ||
      lower === 'hey' ||
      lower.includes('how are you') ||
      lower.includes('good morning') ||
      lower.includes('good evening')
    );
  }

  private isGenericIntent(value: string): boolean {
    const lower = value.toLowerCase();
    return lower.includes('book') || lower.includes('appointment') || lower.includes('doctor') || lower.includes('help');
  }

  private toList(value: string): string[] {
    return (value || '')
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  private pushUserMessage(text: string): void {
    this.messages.push({
      sender: 'user',
      text,
      timestamp: new Date()
    });
  }

  private pushAssistantMessage(text: string, actions?: ChatAction[]): void {
    this.messages.push({
      sender: 'assistant',
      text,
      timestamp: new Date(),
      actions
    });
  }

  private updateRouteContext(url: string): void {
    const cleanUrl = (url || '/').replace(/^\//, '').split('?')[0] || 'welcome';
    this.currentPageLabel = cleanUrl;
  }

  private resolveChatError(err: any): string {
    const backendError = err?.error;

    if (typeof backendError === 'string' && backendError.trim()) {
      return backendError;
    }

    if (backendError?.message) {
      return backendError.message;
    }

    if (err?.message) {
      return err.message;
    }

    return 'I could not reach the AI service right now, but you can still open the full AI assistant or booking page.';
  }

  private getDisplayName(): string {
    return (
      sessionStorage.getItem('username') ||
      sessionStorage.getItem('doctorname') ||
      sessionStorage.getItem('name') ||
      this.getEmail() ||
      'Guest Patient'
    ).replace(/"/g, '');
  }

  private getEmail(): string {
    return (sessionStorage.getItem('loggedUser') || 'guest@smartcare.ai').replace(/"/g, '');
  }

  private getGender(): string {
    return (sessionStorage.getItem('gender') || 'Male').replace(/"/g, '');
  }

  private getAge(): string {
    return sessionStorage.getItem('age') || '30';
  }
}
