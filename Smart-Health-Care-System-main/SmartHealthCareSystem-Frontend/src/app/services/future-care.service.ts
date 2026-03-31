import { Injectable } from '@angular/core';
import { Appointment } from '../models/appointment';
import { Doctor } from '../models/doctor';

export interface SavedDoctorEntry {
  id: string;
  email: string;
  doctorname: string;
  specialization: string;
  experience: string;
  savedAt: string;
}

export interface DoctorReviewEntry {
  id: string;
  doctorEmail: string;
  doctorname: string;
  specialization: string;
  rating: number;
  quote: string;
  createdAt: string;
}

export interface FamilyProfileEntry {
  id: string;
  name: string;
  relation: string;
  age: string;
  conditions: string;
}

export interface ReminderEntry {
  id: string;
  title: string;
  channel: 'email' | 'sms' | 'in-app';
  scheduleAt: string;
  message: string;
  contact: string;
}

export interface ReportEntry {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  summary: string;
}

export interface InvoiceEntry {
  id: string;
  title: string;
  amount: number;
  status: 'pending' | 'paid';
  method: string;
  createdAt: string;
}

export interface AppointmentOverrideEntry {
  id: string;
  status: 'scheduled' | 'rescheduled' | 'cancelled';
  updatedDate: string;
  updatedSlot: string;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class FutureCareService {
  private readonly prefix = 'smartHealthcare.futurecare';

  getSavedDoctors(): SavedDoctorEntry[] {
    return this.read<SavedDoctorEntry[]>('savedDoctors', []);
  }

  toggleSavedDoctor(doctor: Doctor): SavedDoctorEntry[] {
    const list = this.getSavedDoctors();
    const id = doctor.email || doctor.doctorname;
    const exists = list.some(item => item.id === id);
    const next = exists
      ? list.filter(item => item.id !== id)
      : [
          {
            id,
            email: doctor.email,
            doctorname: doctor.doctorname,
            specialization: doctor.specialization,
            experience: doctor.experience,
            savedAt: new Date().toISOString()
          },
          ...list
        ];
    this.write('savedDoctors', next);
    return next;
  }

  getReviews(): DoctorReviewEntry[] {
    return this.read<DoctorReviewEntry[]>('reviews', []);
  }

  addReview(review: Omit<DoctorReviewEntry, 'id' | 'createdAt'>): DoctorReviewEntry[] {
    const next = [
      {
        ...review,
        id: this.id('review'),
        createdAt: new Date().toISOString()
      },
      ...this.getReviews()
    ];
    this.write('reviews', next);
    return next;
  }

  getFamilyProfiles(): FamilyProfileEntry[] {
    return this.read<FamilyProfileEntry[]>('familyProfiles', []);
  }

  addFamilyProfile(profile: Omit<FamilyProfileEntry, 'id'>): FamilyProfileEntry[] {
    const next = [
      {
        ...profile,
        id: this.id('family')
      },
      ...this.getFamilyProfiles()
    ];
    this.write('familyProfiles', next);
    return next;
  }

  removeFamilyProfile(id: string): FamilyProfileEntry[] {
    const next = this.getFamilyProfiles().filter(item => item.id !== id);
    this.write('familyProfiles', next);
    return next;
  }

  getReminders(): ReminderEntry[] {
    return this.read<ReminderEntry[]>('reminders', []);
  }

  addReminder(reminder: Omit<ReminderEntry, 'id'>): ReminderEntry[] {
    const next = [
      {
        ...reminder,
        id: this.id('reminder')
      },
      ...this.getReminders()
    ];
    this.write('reminders', next);
    return next;
  }

  removeReminder(id: string): ReminderEntry[] {
    const next = this.getReminders().filter(item => item.id !== id);
    this.write('reminders', next);
    return next;
  }

  getReports(): ReportEntry[] {
    return this.read<ReportEntry[]>('reports', []);
  }

  addReport(report: Omit<ReportEntry, 'id' | 'uploadedAt'>): ReportEntry[] {
    const next = [
      {
        ...report,
        id: this.id('report'),
        uploadedAt: new Date().toISOString()
      },
      ...this.getReports()
    ];
    this.write('reports', next);
    return next;
  }

  getInvoices(): InvoiceEntry[] {
    return this.read<InvoiceEntry[]>('invoices', []);
  }

  ensureInvoices(appointments: Appointment[]): InvoiceEntry[] {
    const existing = this.getInvoices();
    const generated = [...existing];
    appointments
      .filter(item => (item.appointmentstatus || '').toLowerCase() === 'accept')
      .forEach(item => {
        const id = `${item.email}-${item.date}-${item.slot}`;
        if (!generated.some(invoice => invoice.id === id)) {
          generated.push({
            id,
            title: `${item.specialization || 'Consultation'} visit with ${item.doctorname || 'assigned doctor'}`,
            amount: 120 + (item.admissionstatus === 'true' ? 80 : 0),
            status: 'pending',
            method: 'Unpaid',
            createdAt: new Date().toISOString()
          });
        }
      });
    this.write('invoices', generated);
    return generated;
  }

  markInvoicePaid(id: string, method: string): InvoiceEntry[] {
    const next: InvoiceEntry[] = this.getInvoices().map(item =>
      item.id === id ? { ...item, status: 'paid' as 'paid', method } : item
    );
    this.write('invoices', next);
    return next;
  }

  getAppointmentOverrides(): AppointmentOverrideEntry[] {
    return this.read<AppointmentOverrideEntry[]>('appointmentOverrides', []);
  }

  rescheduleAppointment(id: string, updatedDate: string, updatedSlot: string): AppointmentOverrideEntry[] {
    return this.upsertOverride({
      id,
      status: 'rescheduled',
      updatedDate,
      updatedSlot,
      updatedAt: new Date().toISOString()
    });
  }

  cancelAppointment(id: string): AppointmentOverrideEntry[] {
    return this.upsertOverride({
      id,
      status: 'cancelled',
      updatedDate: '',
      updatedSlot: '',
      updatedAt: new Date().toISOString()
    });
  }

  getReminderLink(reminder: ReminderEntry): string {
    if (reminder.channel === 'email') {
      return `mailto:${encodeURIComponent(reminder.contact)}?subject=${encodeURIComponent(reminder.title)}&body=${encodeURIComponent(reminder.message)}`;
    }
    if (reminder.channel === 'sms') {
      return `sms:${encodeURIComponent(reminder.contact)}?body=${encodeURIComponent(reminder.message)}`;
    }
    return '#';
  }

  private upsertOverride(entry: AppointmentOverrideEntry): AppointmentOverrideEntry[] {
    const current = this.getAppointmentOverrides().filter(item => item.id !== entry.id);
    const next = [entry, ...current];
    this.write('appointmentOverrides', next);
    return next;
  }

  private id(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private read<T>(key: string, fallback: T): T {
    const raw = localStorage.getItem(`${this.prefix}.${key}`);
    if (!raw) {
      return fallback;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  private write(key: string, value: unknown): void {
    localStorage.setItem(`${this.prefix}.${key}`, JSON.stringify(value));
  }
}
