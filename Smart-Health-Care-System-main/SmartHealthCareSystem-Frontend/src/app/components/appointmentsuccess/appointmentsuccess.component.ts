import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-appointmentsuccess',
  templateUrl: './appointmentsuccess.component.html',
  styleUrls: ['./appointmentsuccess.component.css']
})
export class AppointmentsuccessComponent implements OnInit {

  patientName = '';
  email = '';
  doctorName = '';
  specialization = '';
  date = '';
  slot = '';
  patientId = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.patientName = params['patientname'] || '';
      this.email = params['email'] || '';
      this.doctorName = params['doctorname'] || '';
      this.specialization = params['specialization'] || '';
      this.date = params['date'] || '';
      this.slot = params['slot'] || '';
      this.patientId = params['patientid'] || '';
    });
  }
}
