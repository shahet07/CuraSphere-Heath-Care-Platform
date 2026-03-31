import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Appointment } from 'src/app/models/appointment';
import { Doctor } from 'src/app/models/doctor';
import { Prescription } from 'src/app/models/prescription';
import { Slots } from 'src/app/models/slots';
import { User } from 'src/app/models/user';
import { DoctorService } from 'src/app/services/doctor.service';
import { UserService } from 'src/app/services/user.service';

interface OperationsMetric {
  label: string;
  value: string;
  detail: string;
  accentClass: string;
  icon: string;
}

interface OperationsAlert {
  title: string;
  body: string;
  tone: 'critical' | 'attention' | 'success' | 'info';
}

interface OperationsStep {
  title: string;
  detail: string;
  badge: string;
}

@Component({
  selector: 'app-careoperations',
  templateUrl: './careoperations.component.html',
  styleUrls: ['./careoperations.component.css']
})
export class CareoperationsComponent implements OnInit {
  role = '';
  loggedUser = '';
  displayName = '';
  loading = true;
  error = '';

  metrics: OperationsMetric[] = [];
  alerts: OperationsAlert[] = [];
  lifecycleSteps: OperationsStep[] = [];
  notifications: string[] = [];
  recordsHighlights: string[] = [];
  billingHighlights: string[] = [];
  analyticsHighlights: string[] = [];
  availabilityHighlights: string[] = [];
  smartActions: string[] = [];
  slotCards: Array<{ title: string; value: string; detail: string }> = [];

  userProfile?: User;
  doctorProfile?: Doctor;
  appointments: Appointment[] = [];
  prescriptions: Prescription[] = [];
  slots: Slots[] = [];
  users: User[] = [];
  doctors: Doctor[] = [];
  patients: Appointment[] = [];

  constructor(private userService: UserService, private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.role = (sessionStorage.getItem('ROLE') || '').replace(/"/g, '');
    this.loggedUser = (sessionStorage.getItem('loggedUser') || '').replace(/"/g, '');
    this.displayName =
      (sessionStorage.getItem('username') ||
        sessionStorage.getItem('doctorname') ||
        sessionStorage.getItem('name') ||
        this.loggedUser ||
        this.role ||
        'Care Team').replace(/"/g, '');

    if (this.role === 'doctor') {
      this.loadDoctorView();
      return;
    }

    if (this.role === 'admin') {
      this.loadAdminView();
      return;
    }

    this.loadUserView();
  }

  private loadUserView(): void {
    forkJoin({
      profile: this.userService.getProfileDetails(this.loggedUser).pipe(catchError(() => of([]))),
      appointments: this.doctorService.getPatientListByEmail(this.loggedUser).pipe(catchError(() => of([]))),
      slots: this.doctorService.getSlotList().pipe(catchError(() => of([]))),
      doctors: this.doctorService.getDoctorList().pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ profile, appointments, slots, doctors }) => {
        const profileList = profile as User[];
        this.userProfile = profileList?.[0];
        this.displayName = this.userProfile?.username || this.displayName;
        this.appointments = (appointments as Appointment[]) || [];
        this.slots = (slots as Slots[]) || [];
        this.doctors = (doctors as Doctor[]) || [];

        const patientName = this.userProfile?.username || this.displayName;
        this.userService
          .getPrescriptionsByName(patientName)
          .pipe(catchError(() => of([])))
          .subscribe((prescriptions: Prescription[]) => {
            this.prescriptions = prescriptions || [];
            this.buildUserOperationsView();
          });
      },
      error: () => {
        this.error = 'Unable to load the care operations center right now.';
        this.loading = false;
      }
    });
  }

  private loadDoctorView(): void {
    forkJoin({
      profile: this.doctorService.getProfileDetails(this.loggedUser).pipe(catchError(() => of([]))),
      appointments: this.doctorService.getPatientListByDoctorEmail(this.loggedUser).pipe(catchError(() => of([]))),
      todayAppointments: this.doctorService.getPatientListByDoctorEmailAndDate(this.loggedUser).pipe(catchError(() => of([]))),
      slots: this.doctorService.getSlotDetails(this.loggedUser).pipe(catchError(() => of([]))),
      doctors: this.doctorService.getDoctorList().pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ profile, appointments, todayAppointments, slots, doctors }) => {
        const profileList = profile as Doctor[];
        this.doctorProfile = profileList?.[0];
        this.displayName = this.doctorProfile?.doctorname || this.displayName;
        this.appointments = ((todayAppointments as Appointment[])?.length ? (todayAppointments as Appointment[]) : (appointments as Appointment[])) || [];
        this.patients = (appointments as Appointment[]) || [];
        this.slots = (slots as Slots[]) || [];
        this.doctors = (doctors as Doctor[]) || [];
        this.buildDoctorOperationsView();
      },
      error: () => {
        this.error = 'Unable to load the doctor operations center right now.';
        this.loading = false;
      }
    });
  }

  private loadAdminView(): void {
    forkJoin({
      users: this.userService.getAllUsers().pipe(catchError(() => of([]))),
      doctors: this.doctorService.getDoctorList().pipe(catchError(() => of([]))),
      patients: this.doctorService.getPatientList().pipe(catchError(() => of([]))),
      slots: this.doctorService.getSlotList().pipe(catchError(() => of([]))),
      totalAppointments: this.userService.getTotalAppointments().pipe(catchError(() => of([0]))),
      totalPrescriptions: this.userService.getTotalPrescriptions().pipe(catchError(() => of([0])))
    }).subscribe({
      next: ({ users, doctors, patients, slots, totalAppointments, totalPrescriptions }) => {
        this.users = (users as User[]) || [];
        this.doctors = (doctors as Doctor[]) || [];
        this.patients = (patients as Appointment[]) || [];
        this.slots = (slots as Slots[]) || [];
        this.buildAdminOperationsView(
          Number((totalAppointments as number[])[0] || this.patients.length),
          Number((totalPrescriptions as number[])[0] || 0)
        );
      },
      error: () => {
        this.error = 'Unable to load the admin operations center right now.';
        this.loading = false;
      }
    });
  }

  private buildUserOperationsView(): void {
    const confirmedAppointments = this.appointments.filter(item => (item.appointmentstatus || '').toLowerCase() === 'accept').length;
    const pendingAppointments = this.appointments.filter(item => !item.appointmentstatus || (item.appointmentstatus || '').toLowerCase() === 'false').length;
    const availableSlots = this.slots.filter(slot => [slot.amstatus, slot.noonstatus, slot.pmstatus].some(status => (status || '').toLowerCase() === 'unbooked')).length;
    const estimatedBilling = confirmedAppointments * 110 + this.prescriptions.length * 18;

    this.metrics = [
      { label: 'Care Journey', value: `${this.appointments.length}`, detail: 'Appointments tracked end to end', accentClass: 'metric-teal', icon: 'fa-calendar-check-o' },
      { label: 'Confirmed Visits', value: `${confirmedAppointments}`, detail: 'Appointments already accepted', accentClass: 'metric-green', icon: 'fa-check-circle-o' },
      { label: 'Prescription History', value: `${this.prescriptions.length}`, detail: 'Clinical notes and medications on file', accentClass: 'metric-purple', icon: 'fa-sticky-note-o' },
      { label: 'Projected Billing', value: `$${estimatedBilling}`, detail: 'Estimated cost based on active care', accentClass: 'metric-gold', icon: 'fa-credit-card' }
    ];

    this.lifecycleSteps = [
      { title: 'Registration complete', detail: 'Your account is active and ready for personalized care journeys.', badge: 'Done' },
      { title: 'Doctor discovery', detail: `${this.doctors.filter(item => (item.status || '').toLowerCase() === 'accept').length} approved doctors are available for matching.`, badge: 'Live' },
      { title: 'Appointment pipeline', detail: `${pendingAppointments} appointments are pending review and ${confirmedAppointments} are confirmed.`, badge: pendingAppointments ? 'Pending' : 'On track' },
      { title: 'Ongoing care record', detail: `${this.prescriptions.length} prescriptions and follow-up records are available in your workspace.`, badge: this.prescriptions.length ? 'Active' : 'New' }
    ];

    this.alerts = [
      {
        title: pendingAppointments ? 'Pending appointments need attention' : 'Care journey is on track',
        body: pendingAppointments
          ? `You have ${pendingAppointments} appointment request(s) still waiting for doctor approval.`
          : 'No pending approvals right now. Your workflow is clear.',
        tone: pendingAppointments ? 'attention' : 'success'
      },
      {
        title: availableSlots ? 'Slot availability is healthy' : 'Limited slot coverage',
        body: availableSlots
          ? `${availableSlots} date rows still have at least one bookable slot in the network.`
          : 'Open slot coverage is tight. Use the AI assistant to find the best next option.',
        tone: availableSlots ? 'info' : 'critical'
      }
    ];

    this.notifications = [
      `Your workspace is tracking ${this.appointments.length} appointment requests.`,
      confirmedAppointments ? `${confirmedAppointments} visits are already confirmed.` : 'No confirmed visits yet.',
      this.prescriptions.length ? `${this.prescriptions.length} prescription record(s) are ready to review.` : 'No prescriptions on file yet.',
      'The AI assistant can prefill the next appointment with triage, specialty, and slot suggestions.'
    ];

    this.recordsHighlights = [
      this.userProfile ? `Profile on file: ${this.userProfile.username}, ${this.userProfile.gender}, age ${this.userProfile.age}.` : 'Profile details will appear here after your first successful profile sync.',
      this.prescriptions.length
        ? `Latest prescription activity is tracked across ${this.prescriptions.length} record(s).`
        : 'No prescription history has been added yet.',
      `Primary contact email: ${this.loggedUser}.`
    ];

    this.billingHighlights = [
      `$${estimatedBilling} projected billing based on confirmed visits and prescription touchpoints.`,
      confirmedAppointments ? 'Higher-acuity specialties can be priced above the current estimate.' : 'Book and confirm visits to generate a live billing trail.',
      'Receipts and payment status can be layered onto this estimate next.'
    ];

    this.analyticsHighlights = [
      `${Math.round((confirmedAppointments / Math.max(this.appointments.length, 1)) * 100)}% of your tracked appointments are confirmed.`,
      `${availableSlots} slot rows currently show at least one open time block.`,
      `${this.doctors.filter(item => (item.status || '').toLowerCase() === 'accept').length} accepted doctors are discoverable right now.`
    ];

    this.availabilityHighlights = this.summarizeSlots(this.slots);
    this.smartActions = [
      'Open the AI assistant to generate triage guidance and book from the chatbot.',
      'Review approval status before resubmitting a booking for the same doctor/date.',
      'Use your prescription history as the base for future AI report summaries.'
    ];

    this.slotCards = this.buildSlotCards(this.slots);
    this.loading = false;
  }

  private buildDoctorOperationsView(): void {
    const pendingPatients = this.patients.filter(item => !item.appointmentstatus || (item.appointmentstatus || '').toLowerCase() === 'false').length;
    const acceptedPatients = this.patients.filter(item => (item.appointmentstatus || '').toLowerCase() === 'accept').length;
    const openBlocks = this.slots.reduce((count, slot) => count + this.countOpenBlocks(slot), 0);
    const estimatedRevenue = acceptedPatients * 140;

    this.metrics = [
      { label: 'Patient Queue', value: `${this.patients.length}`, detail: 'Appointments tied to your clinic flow', accentClass: 'metric-teal', icon: 'fa-users' },
      { label: 'Today Focus', value: `${this.appointments.length}`, detail: 'Patients on today’s active schedule', accentClass: 'metric-blue', icon: 'fa-clock-o' },
      { label: 'Open Blocks', value: `${openBlocks}`, detail: 'Bookable AM, Noon, or PM blocks remaining', accentClass: 'metric-green', icon: 'fa-calendar' },
      { label: 'Projected Revenue', value: `$${estimatedRevenue}`, detail: 'Estimated from accepted consultations', accentClass: 'metric-gold', icon: 'fa-line-chart' }
    ];

    this.lifecycleSteps = [
      { title: 'Availability published', detail: `${this.slots.length} date schedule entries are visible to patients.`, badge: 'Live' },
      { title: 'Patient intake', detail: `${pendingPatients} appointment request(s) still need a clinical decision.`, badge: pendingPatients ? 'Queue' : 'Clear' },
      { title: 'Active consultations', detail: `${acceptedPatients} visit(s) are already accepted into the care stream.`, badge: acceptedPatients ? 'Running' : 'Idle' },
      { title: 'Prescription handoff', detail: 'Use prescription workflows after consultation to complete the care loop.', badge: 'Ready' }
    ];

    this.alerts = [
      {
        title: pendingPatients ? 'Pending approvals in queue' : 'Approval queue is clear',
        body: pendingPatients
          ? `${pendingPatients} patients are still waiting for you to accept or reject their appointment request.`
          : 'You have no pending appointment decisions right now.',
        tone: pendingPatients ? 'attention' : 'success'
      },
      {
        title: openBlocks ? 'Availability still bookable' : 'Schedule fully booked',
        body: openBlocks
          ? `${openBlocks} schedule block(s) remain open across your published dates.`
          : 'Every visible block is booked. Add more schedule rows to keep intake moving.',
        tone: openBlocks ? 'info' : 'critical'
      }
    ];

    this.notifications = [
      `${this.displayName} has ${this.patients.length} total patient appointment record(s).`,
      this.appointments.length ? `${this.appointments.length} patient(s) appear on today’s working view.` : 'No patients are scheduled for today in the current dataset.',
      pendingPatients ? `${pendingPatients} appointment decision(s) still require action.` : 'Your approval queue is empty.',
      'Use the operations center to spot schedule gaps before they affect bookings.'
    ];

    this.recordsHighlights = [
      this.doctorProfile
        ? `Doctor profile: ${this.doctorProfile.doctorname}, ${this.doctorProfile.specialization}, ${this.doctorProfile.experience} years experience.`
        : 'Doctor profile details could not be loaded from the current session.',
      `${this.patients.length} patient appointment records are available for operational review.`,
      'Prescription creation and clinical note follow-up remain available through the existing workflow.'
    ];

    this.billingHighlights = [
      `$${estimatedRevenue} projected consultation revenue based on accepted visits.`,
      acceptedPatients ? 'Accepted appointments drive the estimate used here.' : 'Accept appointments to start generating revenue estimates.',
      'A richer billing and invoice workflow can now plug into this operations layer.'
    ];

    this.analyticsHighlights = [
      `${Math.round((acceptedPatients / Math.max(this.patients.length, 1)) * 100)}% of patient requests are already accepted.`,
      `${openBlocks} bookable blocks remain across ${this.slots.length} schedule rows.`,
      `${this.doctors.filter(item => item.specialization === this.doctorProfile?.specialization).length} doctors share the same specialization in the network.`
    ];

    this.availabilityHighlights = this.summarizeSlots(this.slots);
    this.smartActions = [
      'Accept or reject pending appointments to keep the intake queue current.',
      'Add more slots if your open-block count drops to zero.',
      'Pair completed consultations with prescriptions to create a stronger patient record trail.'
    ];

    this.slotCards = this.buildSlotCards(this.slots);
    this.loading = false;
  }

  private buildAdminOperationsView(totalAppointments: number, totalPrescriptions: number): void {
    const acceptedDoctors = this.doctors.filter(item => (item.status || '').toLowerCase() === 'accept').length;
    const pendingDoctors = this.doctors.filter(item => !item.status || (item.status || '').toLowerCase() === 'false').length;
    const openBlocks = this.slots.reduce((count, slot) => count + this.countOpenBlocks(slot), 0);
    const estimatedRevenue = totalAppointments * 125 + totalPrescriptions * 15;

    this.metrics = [
      { label: 'Platform Users', value: `${this.users.length}`, detail: 'Registered users on the system', accentClass: 'metric-teal', icon: 'fa-user' },
      { label: 'Doctor Approvals', value: `${acceptedDoctors}/${this.doctors.length}`, detail: 'Approved vs total doctors onboarded', accentClass: 'metric-green', icon: 'fa-user-md' },
      { label: 'Appointments', value: `${totalAppointments}`, detail: 'Patient requests flowing through the platform', accentClass: 'metric-blue', icon: 'fa-calendar-check-o' },
      { label: 'Revenue Signal', value: `$${estimatedRevenue}`, detail: 'Estimated value from consultations and prescriptions', accentClass: 'metric-gold', icon: 'fa-area-chart' }
    ];

    this.lifecycleSteps = [
      { title: 'Onboarding pipeline', detail: `${pendingDoctors} doctor application(s) still need approval action.`, badge: pendingDoctors ? 'Queue' : 'Clear' },
      { title: 'Demand monitoring', detail: `${totalAppointments} appointment request(s) are flowing through the care pipeline.`, badge: 'Live' },
      { title: 'Schedule health', detail: `${openBlocks} open blocks remain across all published slot rows.`, badge: openBlocks ? 'Healthy' : 'Tight' },
      { title: 'Clinical output', detail: `${totalPrescriptions} prescriptions have been issued in the system.`, badge: totalPrescriptions ? 'Active' : 'New' }
    ];

    this.alerts = [
      {
        title: pendingDoctors ? 'Doctor approval queue needs review' : 'Doctor onboarding is current',
        body: pendingDoctors
          ? `${pendingDoctors} doctor profile(s) are still waiting for admin approval.`
          : 'Every doctor record is already approved or resolved.',
        tone: pendingDoctors ? 'attention' : 'success'
      },
      {
        title: openBlocks < 3 ? 'Slot capacity is getting tight' : 'Capacity is available',
        body: openBlocks < 3
          ? 'Network availability is thin. Encourage doctors to publish more schedule rows.'
          : `${openBlocks} bookable blocks are available across the network.`,
        tone: openBlocks < 3 ? 'critical' : 'info'
      }
    ];

    this.notifications = [
      `${this.users.length} users, ${this.doctors.length} doctors, and ${this.patients.length} patient appointment records are active in the platform.`,
      pendingDoctors ? `${pendingDoctors} doctor requests need review in the approval workflow.` : 'No doctor approvals are waiting right now.',
      `${totalPrescriptions} prescriptions have been generated so far.`,
      'This command center is ready for future email, billing, and audit automation layers.'
    ];

    this.recordsHighlights = [
      `${this.patients.length} patient appointment rows create the current operational record base.`,
      `${totalPrescriptions} prescription records contribute to the clinical history trail.`,
      `${acceptedDoctors} approved doctors are available for patient matching and bookings.`
    ];

    this.billingHighlights = [
      `$${estimatedRevenue} estimated total value across appointments and prescription touchpoints.`,
      `${Math.round((totalPrescriptions / Math.max(totalAppointments, 1)) * 100)}% prescription-to-appointment ratio in the current data.`,
      'A full invoice, payment, and receipt engine can now sit on top of these operational summaries.'
    ];

    this.analyticsHighlights = [
      `${Math.round((acceptedDoctors / Math.max(this.doctors.length, 1)) * 100)}% doctor approval rate.`,
      `${Math.round((openBlocks / Math.max(this.slots.length * 3, 1)) * 100)}% of all published blocks remain bookable.`,
      `${Math.round((this.patients.length / Math.max(this.users.length, 1)) * 100)}% patient-to-user activity ratio based on appointment records.`
    ];

    this.availabilityHighlights = this.summarizeSlots(this.slots);
    this.smartActions = [
      'Prioritize doctor approvals when the queue grows.',
      'Watch open-block capacity to prevent appointment bottlenecks.',
      'Use this page as the base for notification, billing, and reporting automations next.'
    ];

    this.slotCards = this.buildSlotCards(this.slots);
    this.loading = false;
  }

  private summarizeSlots(slots: Slots[]): string[] {
    if (!slots.length) {
      return ['No slot data is available yet. Publish doctor schedules to activate availability insights.'];
    }

    return slots.slice(0, 4).map(slot => {
      const openBlocks = this.countOpenBlocks(slot);
      return `${slot.doctorname} | ${slot.specialization} | ${slot.date} | ${openBlocks} open block(s).`;
    });
  }

  private buildSlotCards(slots: Slots[]): Array<{ title: string; value: string; detail: string }> {
    if (!slots.length) {
      return [
        {
          title: 'Availability overview',
          value: 'No slots',
          detail: 'Schedule slots will appear here once they are published.'
        }
      ];
    }

    return slots.slice(0, 3).map(slot => ({
      title: slot.doctorname || 'Schedule row',
      value: `${this.countOpenBlocks(slot)} open`,
      detail: `${slot.specialization} on ${slot.date}`
    }));
  }

  private countOpenBlocks(slot: Slots): number {
    return [slot.amstatus, slot.noonstatus, slot.pmstatus].filter(status => (status || '').toLowerCase() === 'unbooked').length;
  }
}
