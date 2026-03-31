import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Appointment } from 'src/app/models/appointment';
import { Slots } from 'src/app/models/slots';
import { DoctorService } from 'src/app/services/doctor.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-bookappointment',
  templateUrl: './bookappointment.component.html',
  styleUrls: ['./bookappointment.component.css']
})
export class BookappointmentComponent implements OnInit {

  currRole = '';
  loggedUser = '';
  message = '';
  showError = false;
  aiBookingHint = '';
  baseAiBookingHint = '';
  availableSlotCatalog: Slots[] = [];
  availableDoctors: string[] = [];
  availableDates: string[] = [];
  availableSlotsForSelection: string[] = [];
  appointment = new Appointment();
  
  constructor(
    private _service : DoctorService,
    private _router: Router,
    private userService : UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void
  {
    this.loggedUser = JSON.stringify(sessionStorage.getItem('loggedUser')|| '{}');
    this.loggedUser = this.loggedUser.replace(/"/g, '');

    this.currRole = JSON.stringify(sessionStorage.getItem('ROLE')|| '{}'); 
    this.currRole = this.currRole.replace(/"/g, '');

    this._service.getSlotList().subscribe(data => {
      this.availableSlotCatalog = data || [];
      this.rebuildDoctorOptions();
      this.applyAiBookingValidation();
    });

    this.route.queryParams.subscribe(params => {
      if (!params) {
        return;
      }

      this.appointment.patientname = params['patientname'] || this.appointment.patientname;
      this.appointment.email = params['email'] || this.loggedUser;
      this.appointment.gender = params['gender'] || this.appointment.gender || 'Male';
      this.appointment.age = params['age'] || this.appointment.age;
      this.appointment.doctorname = params['doctorname'] || this.appointment.doctorname;
      this.appointment.specialization = params['specialization'] || this.appointment.specialization;
      this.appointment.problem = params['problem'] || this.appointment.problem;
      this.appointment.date = params['date'] || this.appointment.date;
      this.appointment.slot = params['slot'] || this.appointment.slot;
      this.showError = false;
      this.message = '';

      if (params['aiUrgency'] || params['aiCondition']) {
        this.baseAiBookingHint =
          'AI assistant prepared this booking. ' +
          (params['aiCondition'] ? 'Predicted condition: ' + params['aiCondition'] + '. ' : '') +
          (params['aiUrgency'] ? 'Triage urgency: ' + params['aiUrgency'] + '. ' : '') +
          (params['date'] ? 'Suggested date: ' + params['date'] + '. ' : '') +
          (params['slot'] ? 'Suggested slot: ' + params['slot'] + '. ' : '') +
          'Review the recommendation and complete the appointment.';
      } else {
        this.baseAiBookingHint = '';
      }

      this.applyAiBookingValidation();
    });
    
  }

  bookAppointment()
  {
    this.showError = false;
    this.message = '';
    this.userService.addBookingAppointments(this.appointment).subscribe(
      data => {
        console.log("appointment booked Successfully");
        this._router.navigate(['/appointmentsuccess'], {
          queryParams: {
            patientname: data?.patientname || this.appointment.patientname,
            email: data?.email || this.appointment.email,
            doctorname: data?.doctorname || this.appointment.doctorname,
            specialization: data?.specialization || this.appointment.specialization,
            date: data?.date || this.appointment.date,
            slot: data?.slot || this.appointment.slot,
            patientid: data?.patientid || ''
          }
        });
      },
      error => {
        console.log("process Failed");
        this.showError = true;
        this.message = "There is a problem in Booking Your Appointment, Please check slot availability and try again !!!";
        console.log(error.error);
      }
    )
  }

  onDoctorChange(): void
  {
    const matches = this.availableSlotCatalog.filter(entry =>
      entry.doctorname === this.appointment.doctorname && this.getAvailableSlots(entry).length > 0
    );

    this.appointment.specialization = matches[0]?.specialization || '';
    this.availableDates = matches.map(entry => entry.date).sort();

    if (!this.availableDates.includes(this.appointment.date)) {
      this.appointment.date = this.availableDates[0] || '';
    }

    this.onDateChange();
  }

  onDateChange(): void
  {
    const selectedEntry = this.availableSlotCatalog.find(entry =>
      entry.doctorname === this.appointment.doctorname && entry.date === this.appointment.date
    );

    this.availableSlotsForSelection = selectedEntry ? this.getAvailableSlots(selectedEntry) : [];

    if (!this.availableSlotsForSelection.includes(this.appointment.slot)) {
      this.appointment.slot = this.availableSlotsForSelection[0] || '';
    }
  }

  private applyAiBookingValidation(): void
  {
    if (!this.availableSlotCatalog.length) {
      return;
    }

    const doctorname = (this.appointment.doctorname || '').trim();
    const specialization = (this.appointment.specialization || '').trim();
    const date = (this.appointment.date || '').trim();
    const slot = (this.appointment.slot || '').trim();

    const isPlaceholderDoctor =
      !doctorname ||
      doctorname.toLowerCase() === 'select doctor' ||
      doctorname.toLowerCase().includes('not available') ||
      doctorname.toLowerCase().includes('recommended specialist');

    const notes: string[] = [];
    const fallbackDoctor = specialization
      ? this.availableSlotCatalog.find(entry =>
          entry.specialization === specialization && this.getAvailableSlots(entry).length > 0
        )?.doctorname
      : '';

    if (isPlaceholderDoctor || !this.availableDoctors.includes(doctorname)) {
      if (fallbackDoctor) {
        this.appointment.doctorname = fallbackDoctor;
        notes.push('I matched your request to the nearest available doctor: ' + fallbackDoctor + '.');
      } else if (!this.availableDoctors.includes(doctorname)) {
        this.appointment.doctorname = this.availableDoctors[0] || '';
      }
    }

    this.onDoctorChange();

    if (date && this.availableDates.includes(date)) {
      this.appointment.date = date;
      this.onDateChange();
    } else if (date && this.appointment.date) {
      notes.push('The suggested date was not available, so I switched to the next open date: ' + this.appointment.date + '.');
    }

    if (slot && this.availableSlotsForSelection.includes(slot)) {
      this.appointment.slot = slot;
    } else if (slot && this.appointment.slot) {
      notes.push('The suggested slot was not available, so I switched to the next open slot: ' + this.appointment.slot + '.');
    }

    this.aiBookingHint = [this.baseAiBookingHint, ...notes].filter(Boolean).join(' ');
  }

  private rebuildDoctorOptions(): void
  {
    this.availableDoctors = Array.from(
      new Set(
        this.availableSlotCatalog
          .filter(entry => this.getAvailableSlots(entry).length > 0)
          .map(entry => entry.doctorname)
      )
    ).sort();
  }

  private getAvailableSlots(entry: Slots): string[]
  {
    const availableSlots: string[] = [];
    if (entry.amstatus === 'unbooked') {
      availableSlots.push('AM slot');
    }
    if (entry.noonstatus === 'unbooked') {
      availableSlots.push('Noon slot');
    }
    if (entry.pmstatus === 'unbooked') {
      availableSlots.push('PM slot');
    }
    return availableSlots;
  }

}
