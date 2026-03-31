export interface AIInsightsRequest {
  patientName: string;
  email: string;
  gender: string;
  specializationPreference: string;
  question: string;
  symptomNarrative: string;
  reportText: string;
  preferredDate: string;
  age: number;
  temperature: number;
  bmi: number;
  distanceKm: number;
  missedAppointments: number;
  leadTimeDays: number;
  stressLevel: number;
  sleepHours: number;
  painLevel: number;
  smoker: boolean;
  alcoholUse: boolean;
  familyHistory: boolean;
  hasReminder: boolean;
  weekendAppointment: boolean;
  symptoms: string[];
  chronicConditions: string[];
  allergies: string[];
  currentMedicines: string[];
}

export interface AIInsightsResponse {
  symptomTextAnalysis: {
    normalizedNarrative: string;
    clinicalIntent: string;
    recommendedSpecialization: string;
    triagePriority: string;
    detectedSymptoms: string[];
    urgencySignals: string[];
  };
  diseasePrediction: {
    probableCondition: string;
    confidence: number;
    urgency: string;
    summary: string;
    matchedSymptoms: string[];
  };
  doctorRecommendation: {
    recommendedSpecialization: string;
    rationale: string;
    doctors: Array<{
      doctorname: string;
      email: string;
      specialization: string;
      experience: string;
      reason: string;
      rankingScore: number;
    }>;
  };
  slotRecommendation: {
    recommendedDate: string;
    recommendedSlot: string;
    recommendedDoctor: string;
    recommendedSpecialization: string;
    rationale: string;
    alternatives: Array<{
      doctorname: string;
      specialization: string;
      date: string;
      slot: string;
      status: string;
    }>;
  };
  noShowPrediction: {
    riskScore: number;
    riskLevel: string;
    drivers: string[];
    actions: string[];
  };
  prescriptionSupport: {
    summary: string;
    suggestions: string[];
    alerts: string[];
    disclaimer: string;
  };
  patientRisk: {
    score: number;
    level: string;
    contributors: string[];
    recommendations: string[];
  };
  admissionRisk: {
    score: number;
    level: string;
    drivers: string[];
    actions: string[];
  };
  reportSummary: {
    clinicalSummary: string;
    patientFriendlySummary: string;
    highlights: string[];
    followUpQuestions: string[];
  };
  triageChat: {
    urgency: string;
    response: string;
    nextSteps: string[];
    followUpQuestions: string[];
  };
}
