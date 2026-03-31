import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Appointment } from 'src/app/models/appointment';
import { Doctor } from 'src/app/models/doctor';
import { Prescription } from 'src/app/models/prescription';
import { Slots } from 'src/app/models/slots';
import { User } from 'src/app/models/user';
import { DoctorService } from 'src/app/services/doctor.service';
import {
  DoctorReviewEntry,
  FamilyProfileEntry,
  FutureCareService,
  InvoiceEntry,
  ReminderEntry,
  ReportEntry,
  SavedDoctorEntry
} from 'src/app/services/future-care.service';
import { UserService } from 'src/app/services/user.service';

interface HubMetric {
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone: string;
}

interface HubCard {
  title: string;
  detail: string;
  accent: string;
  icon: string;
  badge?: string;
}

interface HubTimeline {
  title: string;
  detail: string;
  when: string;
}

interface AppointmentView extends Appointment {
  localId: string;
  effectiveStatus: string;
  effectiveDate: string;
  effectiveSlot: string;
}

@Component({
  selector: 'app-futurecarehub',
  templateUrl: './futurecarehub.component.html',
  styleUrls: ['./futurecarehub.component.css']
})
export class FuturecarehubComponent implements OnInit {
  role = 'guest';
  displayName = 'Care Explorer';
  loggedUser = '';
  loading = true;
  actionMessage = '';

  metrics: HubMetric[] = [];
  productCards: HubCard[] = [];
  aiCards: HubCard[] = [];
  deepLearningCards: HubCard[] = [];
  adminCards: HubCard[] = [];
  doctorCards: HubCard[] = [];
  patientCards: HubCard[] = [];
  timeline: HubTimeline[] = [];

  users: User[] = [];
  doctors: Doctor[] = [];
  appointments: Appointment[] = [];
  slots: Slots[] = [];
  prescriptions: Prescription[] = [];
  profile?: User;
  approvedDoctors: Doctor[] = [];

  appointmentViews: AppointmentView[] = [];
  savedDoctorEntries: SavedDoctorEntry[] = [];
  reviewEntries: DoctorReviewEntry[] = [];
  familyProfiles: FamilyProfileEntry[] = [];
  reminderEntries: ReminderEntry[] = [];
  reportEntries: ReportEntry[] = [];
  invoiceEntries: InvoiceEntry[] = [];

  selectedAppointmentId = '';
  rescheduleDate = '';
  rescheduleSlot = 'AM';

  reviewDoctorEmail = '';
  reviewDoctorName = '';
  reviewRating = 5;
  reviewQuote = '';

  familyName = '';
  familyRelation = 'Parent';
  familyAge = '';
  familyConditions = '';

  reminderTitle = 'Appointment Reminder';
  reminderChannel: 'email' | 'sms' | 'in-app' = 'email';
  reminderScheduleAt = '';
  reminderMessage = 'Please remember your upcoming care step.';
  reminderContact = '';

  reportSummary = 'Upload a report to store it in your local care history with an AI-style summary.';
  voiceStatus = 'Use the browser voice button to capture spoken symptoms.';
  voiceTranscript = '';
  screeningResult = 'Upload an image and choose a demo type to generate a screening response.';
  screeningPreview = '';
  screeningMode: 'skin' | 'xray' = 'skin';

  constructor(
    private doctorService: DoctorService,
    private futureCareService: FutureCareService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.role = (sessionStorage.getItem('ROLE') || 'guest').replace(/"/g, '').toLowerCase() || 'guest';
    this.loggedUser = (sessionStorage.getItem('loggedUser') || '').replace(/"/g, '');
    this.displayName =
      (sessionStorage.getItem('username') ||
        sessionStorage.getItem('doctorname') ||
        sessionStorage.getItem('name') ||
        this.loggedUser ||
        'Care Explorer').replace(/"/g, '');

    forkJoin({
      users: this.userService.getAllUsers().pipe(catchError(() => of([]))),
      doctors: this.doctorService.getDoctorList().pipe(catchError(() => of([]))),
      appointments: this.doctorService.getPatientList().pipe(catchError(() => of([]))),
      slots: this.doctorService.getSlotList().pipe(catchError(() => of([]))),
      profile: this.loggedUser ? this.userService.getProfileDetails(this.loggedUser).pipe(catchError(() => of([]))) : of([]),
      prescriptions: this.loggedUser ? this.userService.getPrescriptionsByName(this.displayName).pipe(catchError(() => of([]))) : of([])
    }).subscribe(({ users, doctors, appointments, slots, profile, prescriptions }) => {
      this.users = (users as User[]) || [];
      this.doctors = (doctors as Doctor[]) || [];
      this.appointments = (appointments as Appointment[]) || [];
      this.slots = (slots as Slots[]) || [];
      this.profile = ((profile as User[]) || [])[0];
      this.prescriptions = (prescriptions as Prescription[]) || [];
      if (this.profile?.username) {
        this.displayName = this.profile.username;
      }
      this.approvedDoctors = this.doctors.filter(item => (item.status || '').toLowerCase() === 'accept');
      this.reminderContact = this.loggedUser;
      this.reviewDoctorEmail = this.approvedDoctors[0]?.email || '';
      this.reviewDoctorName = this.approvedDoctors[0]?.doctorname || '';
      this.refreshFutureCareState();
      this.buildHub();
      this.loading = false;
    });
  }

  refreshFutureCareState(): void {
    this.savedDoctorEntries = this.futureCareService.getSavedDoctors();
    this.reviewEntries = this.futureCareService.getReviews();
    this.familyProfiles = this.futureCareService.getFamilyProfiles();
    this.reminderEntries = this.futureCareService.getReminders();
    this.reportEntries = this.futureCareService.getReports();
    this.invoiceEntries = this.futureCareService.ensureInvoices(this.getRelevantAppointments());
    this.appointmentViews = this.getRelevantAppointments().map(item => this.mapAppointmentView(item));
    if (!this.loading) {
      this.buildHub();
    }
  }

  toggleSavedDoctor(doctor: Doctor): void {
    this.savedDoctorEntries = this.futureCareService.toggleSavedDoctor(doctor);
    this.actionMessage = `${doctor.doctorname} saved list updated.`;
    this.buildHub();
  }

  isDoctorSaved(doctor: Doctor): boolean {
    const id = doctor.email || doctor.doctorname;
    return this.savedDoctorEntries.some(item => item.id === id);
  }

  submitReview(): void {
    if (!this.reviewDoctorEmail || !this.reviewQuote.trim()) {
      this.actionMessage = 'Choose a doctor and add a review message before submitting.';
      return;
    }

    const match = this.approvedDoctors.find(item => item.email === this.reviewDoctorEmail);
    this.reviewEntries = this.futureCareService.addReview({
      doctorEmail: this.reviewDoctorEmail,
      doctorname: match?.doctorname || this.reviewDoctorName || 'Selected doctor',
      specialization: match?.specialization || 'General Care',
      rating: this.reviewRating,
      quote: this.reviewQuote.trim()
    });
    this.reviewQuote = '';
    this.actionMessage = 'Doctor review saved successfully.';
    this.buildHub();
  }

  addFamilyProfile(): void {
    if (!this.familyName.trim() || !this.familyAge.trim()) {
      this.actionMessage = 'Please enter family member name and age.';
      return;
    }

    this.familyProfiles = this.futureCareService.addFamilyProfile({
      name: this.familyName.trim(),
      relation: this.familyRelation,
      age: this.familyAge.trim(),
      conditions: this.familyConditions.trim()
    });
    this.familyName = '';
    this.familyAge = '';
    this.familyConditions = '';
    this.actionMessage = 'Family member profile added.';
    this.buildHub();
  }

  removeFamilyProfile(id: string): void {
    this.familyProfiles = this.futureCareService.removeFamilyProfile(id);
    this.actionMessage = 'Family member profile removed.';
    this.buildHub();
  }

  addReminder(): void {
    if (!this.reminderTitle.trim() || !this.reminderScheduleAt) {
      this.actionMessage = 'Please add a reminder title and schedule time.';
      return;
    }

    this.reminderEntries = this.futureCareService.addReminder({
      title: this.reminderTitle.trim(),
      channel: this.reminderChannel,
      scheduleAt: this.reminderScheduleAt,
      message: this.reminderMessage.trim(),
      contact: this.reminderContact.trim()
    });

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    if ('Notification' in window && Notification.permission === 'granted' && this.reminderChannel === 'in-app') {
      new Notification(this.reminderTitle, { body: this.reminderMessage });
    }

    this.actionMessage = 'Reminder saved. Use the quick link to open email or SMS when needed.';
    this.buildHub();
  }

  removeReminder(id: string): void {
    this.reminderEntries = this.futureCareService.removeReminder(id);
    this.actionMessage = 'Reminder removed.';
    this.buildHub();
  }

  getReminderLink(reminder: ReminderEntry): string {
    return this.futureCareService.getReminderLink(reminder);
  }

  handleReportUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) {
      return;
    }

    const summary = `${file.name} stored for viewing history. AI summary: likely includes diagnosis context, observations, medications, and follow-up instructions.`;
    this.reportEntries = this.futureCareService.addReport({
      name: file.name,
      type: file.type || 'unknown',
      summary
    });
    this.reportSummary = summary;
    this.actionMessage = 'Lab report added to the local care history.';
    this.buildHub();
    input.value = '';
  }

  startVoiceRecognition(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.voiceStatus = 'Voice recognition is not supported in this browser. Try Chrome or Edge.';
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      this.voiceTranscript = transcript;
      this.voiceStatus = `Captured symptom note: ${transcript}`;
    };
    recognition.onerror = () => {
      this.voiceStatus = 'Voice capture failed. Please try again in a quieter environment.';
    };
    recognition.start();
  }

  handleScreeningUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.screeningPreview = String(reader.result || '');
      this.screeningResult = this.buildScreeningResult(file.name, file.size, this.screeningMode);
    };
    reader.readAsDataURL(file);
  }

  rescheduleSelectedAppointment(): void {
    if (!this.selectedAppointmentId || !this.rescheduleDate) {
      this.actionMessage = 'Pick an appointment and a new date first.';
      return;
    }

    this.futureCareService.rescheduleAppointment(this.selectedAppointmentId, this.rescheduleDate, this.rescheduleSlot);
    this.refreshFutureCareState();
    this.actionMessage = 'Appointment rescheduled in the Future Care Hub.';
  }

  cancelSelectedAppointment(): void {
    if (!this.selectedAppointmentId) {
      this.actionMessage = 'Pick an appointment to cancel.';
      return;
    }

    this.futureCareService.cancelAppointment(this.selectedAppointmentId);
    this.refreshFutureCareState();
    this.actionMessage = 'Appointment cancelled in the Future Care Hub.';
  }

  markInvoicePaid(invoiceId: string, method: string): void {
    this.invoiceEntries = this.futureCareService.markInvoicePaid(invoiceId, method);
    this.actionMessage = `Invoice marked as paid with ${method}.`;
    this.buildHub();
  }

  getPaidRevenue(): number {
    return this.invoiceEntries.filter(item => item.status === 'paid').reduce((sum, item) => sum + item.amount, 0);
  }

  getDoctorAverageRating(doctor: Doctor): string {
    const matches = this.reviewEntries.filter(item => item.doctorEmail === doctor.email);
    if (!matches.length) {
      return 'New';
    }
    const average = matches.reduce((sum, item) => sum + item.rating, 0) / matches.length;
    return average.toFixed(1);
  }

  private buildHub(): void {
    const confirmedAppointments = this.getRelevantAppointments().filter(item => (item.appointmentstatus || '').toLowerCase() === 'accept');
    const openSlotRows = this.slots.filter(slot => [slot.amstatus, slot.noonstatus, slot.pmstatus].some(status => (status || '').toLowerCase() === 'unbooked'));
    const specializations = Array.from(new Set(this.approvedDoctors.map(item => item.specialization).filter(Boolean)));
    const cancelled = this.appointmentViews.filter(item => item.effectiveStatus === 'cancelled').length;

    this.metrics = [
      {
        label: 'Working Hub Modules',
        value: '12',
        detail: 'Live, interactive Future Care features now available inside the app.',
        icon: 'fa-rocket',
        tone: 'teal'
      },
      {
        label: 'Approved Doctors',
        value: `${this.approvedDoctors.length}`,
        detail: `${specializations.length} specialties available for ranking, saving, and review.`,
        icon: 'fa-user-md',
        tone: 'blue'
      },
      {
        label: 'Appointment Actions',
        value: `${this.appointmentViews.length}`,
        detail: `${cancelled} locally cancelled or rescheduled journeys are now tracked in the hub.`,
        icon: 'fa-calendar-check-o',
        tone: 'gold'
      },
      {
        label: 'Paid Revenue',
        value: `$${this.getPaidRevenue()}`,
        detail: `${this.invoiceEntries.filter(item => item.status === 'paid').length} invoices marked paid in the billing flow.`,
        icon: 'fa-credit-card',
        tone: 'rose'
      }
    ];

    this.productCards = [
      {
        title: 'Working appointment status flow',
        detail: 'Select appointments below to reschedule or cancel them and keep the changed state persistent in the hub.',
        accent: 'teal',
        icon: 'fa-exchange',
        badge: 'Working'
      },
      {
        title: 'Availability and emergency handling',
        detail: `${openSlotRows.length} slot rows still have available time blocks for booking and urgent routing.`,
        accent: 'green',
        icon: 'fa-clock-o'
      },
      {
        title: 'Email, SMS, and in-app reminders',
        detail: 'Create reminders that open real email or SMS drafts, or trigger browser notifications for in-app nudges.',
        accent: 'gold',
        icon: 'fa-bell-o'
      },
      {
        title: 'Reports, invoices, and patient records',
        detail: `${this.reportEntries.length} uploaded report entries and ${this.invoiceEntries.length} invoice records are stored inside the app.`,
        accent: 'rose',
        icon: 'fa-file-text-o'
      }
    ];

    this.aiCards = [
      {
        title: 'Symptom checker and confidence score',
        detail: 'The AI Assistant remains the predictive core for condition, urgency, and follow-up guidance.',
        accent: 'teal',
        icon: 'fa-stethoscope',
        badge: 'AI'
      },
      {
        title: 'Saved doctors and recommendation memory',
        detail: `${this.savedDoctorEntries.length} saved doctor entries are persisted for rebooking and personal care preference.`,
        accent: 'blue',
        icon: 'fa-star-o'
      },
      {
        title: 'Prescription and report support',
        detail: `${this.prescriptions.length} prescriptions are available to power safer medication decisions and summaries.`,
        accent: 'green',
        icon: 'fa-medkit'
      }
    ];

    this.deepLearningCards = [
      {
        title: 'Voice symptom capture',
        detail: 'Uses browser speech recognition when supported, so spoken symptoms become structured intake text.',
        accent: 'gold',
        icon: 'fa-microphone',
        badge: 'Voice'
      },
      {
        title: 'Image screening demo',
        detail: 'Upload an image and run skin or X-ray style demo screening directly in the hub.',
        accent: 'rose',
        icon: 'fa-camera',
        badge: 'Vision'
      },
      {
        title: 'Conversational triage handoff',
        detail: 'The floating chatbot and AI Assistant continue to hand off into booking and care planning.',
        accent: 'blue',
        icon: 'fa-commenting'
      }
    ];

    this.adminCards = [
      {
        title: 'Revenue analytics',
        detail: `Pending invoices: ${this.invoiceEntries.filter(item => item.status === 'pending').length}. Paid revenue tracked: $${this.getPaidRevenue()}.`,
        accent: 'blue',
        icon: 'fa-line-chart'
      },
      {
        title: 'Department and demand signals',
        detail: `${specializations.length} specialties and ${this.appointmentViews.length} tracked appointment journeys available for admin visibility.`,
        accent: 'gold',
        icon: 'fa-dashboard'
      }
    ];

    this.doctorCards = [
      {
        title: 'Daily queue visibility',
        detail: `${confirmedAppointments.length} accepted appointments can feed queue planning and care readiness.`,
        accent: 'teal',
        icon: 'fa-list-alt'
      },
      {
        title: 'Performance snapshot',
        detail: `${this.reviewEntries.length} patient reviews contribute to performance and trust visibility inside the hub.`,
        accent: 'blue',
        icon: 'fa-trophy'
      }
    ];

    this.patientCards = [
      {
        title: 'Family profiles and history',
        detail: `${this.familyProfiles.length} family profiles and ${this.reportEntries.length} report records are available in the local care history.`,
        accent: 'teal',
        icon: 'fa-users'
      },
      {
        title: 'Saved doctors and reminders',
        detail: `${this.savedDoctorEntries.length} saved doctors and ${this.reminderEntries.length} reminders are now persistent and usable.`,
        accent: 'gold',
        icon: 'fa-heart'
      }
    ];

    this.timeline = [
      { title: 'Profile and family care', detail: 'Store family profiles, reports, and reminders for repeated care journeys.', when: 'Now' },
      { title: 'Book and change appointments', detail: 'Reschedule or cancel tracked appointments directly from the hub controls.', when: 'Before visit' },
      { title: 'Track billing and reviews', detail: 'Generate invoice records and capture doctor feedback after care is delivered.', when: 'After visit' }
    ];
  }

  private getRelevantAppointments(): Appointment[] {
    if (this.role === 'user' && this.loggedUser) {
      return this.appointments.filter(item => item.email === this.loggedUser);
    }
    if (this.role === 'doctor' && this.displayName) {
      return this.appointments.filter(item => item.doctorname === this.displayName);
    }
    return this.appointments;
  }

  private mapAppointmentView(item: Appointment): AppointmentView {
    const localId = `${item.email}-${item.date}-${item.slot}-${item.doctorname}`;
    const override = this.futureCareService.getAppointmentOverrides().find(entry => entry.id === localId);
    return {
      ...item,
      localId,
      effectiveStatus: override?.status || ((item.appointmentstatus || '').toLowerCase() === 'accept' ? 'confirmed' : 'pending'),
      effectiveDate: override?.updatedDate || item.date,
      effectiveSlot: override?.updatedSlot || item.slot
    };
  }

  private buildScreeningResult(fileName: string, fileSize: number, mode: 'skin' | 'xray'): string {
    const risk = fileSize > 700000 ? 'moderate' : 'low';
    if (mode === 'skin') {
      return `Skin screening demo for ${fileName}: texture and contrast patterns suggest ${risk} concern. Recommended next step: dermatologist review if symptoms persist.`;
    }
    return `X-ray screening demo for ${fileName}: shadow density appears ${risk} concern. Recommended next step: physician or radiology follow-up.`;
  }
}
