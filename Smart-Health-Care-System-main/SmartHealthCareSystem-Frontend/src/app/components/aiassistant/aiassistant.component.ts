import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AIInsightsRequest, AIInsightsResponse } from 'src/app/models/ai';
import { AiService } from 'src/app/services/ai.service';

interface AIDemoPreset {
  label: string;
  subtitle: string;
  visual: string;
  accentClass: string;
  patientName: string;
  email: string;
  gender: string;
  age: number;
  temperature: number;
  bmi: number;
  painLevel: number;
  stressLevel: number;
  sleepHours: number;
  distanceKm: number;
  missedAppointments: number;
  leadTimeDays: number;
  symptomInput: string;
  symptomNarrative: string;
  chronicConditionInput: string;
  allergyInput: string;
  medicineInput: string;
  reportText: string;
  preferredDate: string;
  specializationPreference: string;
  question: string;
  smoker: boolean;
  alcoholUse: boolean;
  familyHistory: boolean;
  hasReminder: boolean;
  weekendAppointment: boolean;
}

@Component({
  selector: 'app-aiassistant',
  templateUrl: './aiassistant.component.html',
  styleUrls: ['./aiassistant.component.css']
})
export class AiassistantComponent implements OnInit {

  loading = false;
  error = '';
  results?: AIInsightsResponse;
  activePresetLabel = 'Custom';
  symptomInput = 'fever, cough, fatigue';
  symptomNarrativeInput = 'Patient reports fever, dry cough, fatigue, and mild throat irritation for the last three days.';
  chronicConditionInput = '';
  allergyInput = '';
  medicineInput = '';
  reportTextInput = 'CBC stable. Mild inflammatory markers. No acute red-flag findings documented.';

  demoPresets: AIDemoPreset[] = [
    {
      label: 'Flu Triage',
      subtitle: 'Fast primary-care intake with mild infection signs',
      visual: 'assets/img/maleuser.png',
      accentClass: 'preset-teal',
      patientName: 'Aarav Mehta',
      email: 'aarav.demo@gmail.com',
      gender: 'Male',
      age: 29,
      temperature: 101.4,
      bmi: 23.8,
      painLevel: 4,
      stressLevel: 5,
      sleepHours: 5,
      distanceKm: 6,
      missedAppointments: 1,
      leadTimeDays: 4,
      symptomInput: 'fever, cough, fatigue, sore throat, body ache',
      symptomNarrative: 'Patient reports fever, cough, fatigue, sore throat, and body ache for 3 days with no chest pain or breathing distress.',
      chronicConditionInput: '',
      allergyInput: 'penicillin',
      medicineInput: 'paracetamol',
      reportText: 'Urgent care note: mild viral upper respiratory presentation. Hydration and monitoring advised.',
      preferredDate: '2026-04-03',
      specializationPreference: 'General Physician',
      question: 'I have fever and cough for 3 days. What kind of doctor should I see?',
      smoker: false,
      alcoholUse: false,
      familyHistory: false,
      hasReminder: true,
      weekendAppointment: false
    },
    {
      label: 'Cardiac Risk',
      subtitle: 'High-alert patient profile with escalation signals',
      visual: 'assets/img/femaledoctor.png',
      accentClass: 'preset-gold',
      patientName: 'Neha Sharma',
      email: 'neha.demo@gmail.com',
      gender: 'Female',
      age: 58,
      temperature: 98.9,
      bmi: 31.2,
      painLevel: 7,
      stressLevel: 8,
      sleepHours: 4,
      distanceKm: 18,
      missedAppointments: 2,
      leadTimeDays: 12,
      symptomInput: 'chest pain, shortness of breath, dizziness, fatigue',
      symptomNarrative: 'Patient describes intermittent chest pain with dizziness and shortness of breath, worse on exertion, plus increasing fatigue.',
      chronicConditionInput: 'hypertension, diabetes',
      allergyInput: 'ibuprofen',
      medicineInput: 'metformin, amlodipine',
      reportText: 'Care summary: elevated blood pressure history, diabetic risk profile, episodes of chest tightness, advised cardiac workup.',
      preferredDate: '2026-04-01',
      specializationPreference: 'Cardiologist',
      question: 'Is this urgent and should I see a heart specialist?',
      smoker: true,
      alcoholUse: false,
      familyHistory: true,
      hasReminder: false,
      weekendAppointment: true
    },
    {
      label: 'Allergy Check',
      subtitle: 'Outpatient recommendation flow with allergy support',
      visual: 'assets/img/femaleuser.png',
      accentClass: 'preset-purple',
      patientName: 'Sara Khan',
      email: 'sara.demo@gmail.com',
      gender: 'Female',
      age: 24,
      temperature: 98.4,
      bmi: 21.1,
      painLevel: 2,
      stressLevel: 3,
      sleepHours: 7,
      distanceKm: 3,
      missedAppointments: 0,
      leadTimeDays: 2,
      symptomInput: 'rash, itching, sneezing, itchy eyes, runny nose',
      symptomNarrative: 'Patient has itchy rash with sneezing, watery eyes, and runny nose after outdoor exposure. No fever reported.',
      chronicConditionInput: 'asthma',
      allergyInput: 'dust, pollen',
      medicineInput: 'cetirizine',
      reportText: 'Observation note: probable allergic trigger after environmental exposure. No airway compromise at this time.',
      preferredDate: '2026-04-02',
      specializationPreference: 'Allergist',
      question: 'I have itching and sneezing. Which specialist should I book?',
      smoker: false,
      alcoholUse: false,
      familyHistory: true,
      hasReminder: true,
      weekendAppointment: false
    }
  ];

  form: AIInsightsRequest = {
    patientName: '',
    email: '',
    gender: 'Male',
    specializationPreference: '',
    question: 'What kind of doctor should I see and how urgent is this?',
    symptomNarrative: this.symptomNarrativeInput,
    reportText: this.reportTextInput,
    preferredDate: '',
    age: 30,
    temperature: 98.6,
    bmi: 24,
    distanceKm: 5,
    missedAppointments: 0,
    leadTimeDays: 3,
    stressLevel: 4,
    sleepHours: 7,
    painLevel: 3,
    smoker: false,
    alcoholUse: false,
    familyHistory: false,
    hasReminder: true,
    weekendAppointment: false,
    symptoms: [],
    chronicConditions: [],
    allergies: [],
    currentMedicines: []
  };

  constructor(private aiService: AiService, private router: Router) { }

  ngOnInit(): void {
    this.form.email = (sessionStorage.getItem('loggedUser') || '').replace(/"/g, '');
    this.form.patientName = (sessionStorage.getItem('username') || sessionStorage.getItem('ROLE') || '').replace(/"/g, '');
    this.form.gender = (sessionStorage.getItem('gender') || 'Male').replace(/"/g, '');
  }

  applyPreset(preset: AIDemoPreset): void {
    this.activePresetLabel = preset.label;
    this.error = '';
    this.results = undefined;
    this.symptomInput = preset.symptomInput;
    this.chronicConditionInput = preset.chronicConditionInput;
    this.allergyInput = preset.allergyInput;
    this.medicineInput = preset.medicineInput;
    this.symptomNarrativeInput = preset.symptomNarrative;
    this.reportTextInput = preset.reportText;

    this.form = {
      ...this.form,
      patientName: preset.patientName,
      email: preset.email,
      gender: preset.gender,
      age: preset.age,
      temperature: preset.temperature,
      bmi: preset.bmi,
      painLevel: preset.painLevel,
      stressLevel: preset.stressLevel,
      sleepHours: preset.sleepHours,
      distanceKm: preset.distanceKm,
      missedAppointments: preset.missedAppointments,
      leadTimeDays: preset.leadTimeDays,
      symptomNarrative: preset.symptomNarrative,
      reportText: preset.reportText,
      preferredDate: preset.preferredDate,
      specializationPreference: preset.specializationPreference,
      question: preset.question,
      smoker: preset.smoker,
      alcoholUse: preset.alcoholUse,
      familyHistory: preset.familyHistory,
      hasReminder: preset.hasReminder,
      weekendAppointment: preset.weekendAppointment,
      symptoms: this.toList(preset.symptomInput),
      chronicConditions: this.toList(preset.chronicConditionInput),
      allergies: this.toList(preset.allergyInput),
      currentMedicines: this.toList(preset.medicineInput)
    };
  }

  generateInsights(): void {
    this.loading = true;
    this.error = '';

    const payload: AIInsightsRequest = {
      ...this.form,
      symptomNarrative: this.symptomNarrativeInput,
      reportText: this.reportTextInput,
      symptoms: this.toList(this.symptomInput),
      chronicConditions: this.toList(this.chronicConditionInput),
      allergies: this.toList(this.allergyInput),
      currentMedicines: this.toList(this.medicineInput)
    };

    this.aiService.generateInsights(payload).subscribe({
      next: data => {
        this.results = data;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        const backendError = err?.error;
        if (typeof backendError === 'string' && backendError.trim()) {
          this.error = backendError;
        } else if (backendError?.message) {
          this.error = backendError.message;
        } else if (backendError?.error) {
          this.error = backendError.error;
        } else if (backendError) {
          this.error = JSON.stringify(backendError, null, 2);
        } else if (err?.message) {
          this.error = err.message;
        } else {
          this.error = 'Unable to generate AI insights right now.';
        }
      }
    });
  }

  bookRecommendedAppointment(): void {
    if (!this.results) {
      return;
    }

    const suggestedDoctor = this.results.doctorRecommendation.doctors[0];
    const slotSuggestion = this.results.slotRecommendation;
    const problemSummary = this.toSentence(this.toList(this.symptomInput));

    this.router.navigate(['/bookappointment'], {
      queryParams: {
        patientname: this.form.patientName,
        email: this.form.email,
        gender: this.form.gender,
        age: this.form.age,
        doctorname: slotSuggestion?.recommendedDoctor || suggestedDoctor?.doctorname || '',
        specialization: slotSuggestion?.recommendedSpecialization || this.results.doctorRecommendation.recommendedSpecialization || this.form.specializationPreference,
        problem: problemSummary || this.results.diseasePrediction.probableCondition,
        date: slotSuggestion?.recommendedDate || this.form.preferredDate || '',
        slot: slotSuggestion?.recommendedSlot || '',
        aiUrgency: this.results.triageChat.urgency,
        aiCondition: this.results.diseasePrediction.probableCondition
      }
    });
  }

  private toList(value: string): string[] {
    return (value || '')
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  private toSentence(items: string[]): string {
    return items.join(', ');
  }
}
