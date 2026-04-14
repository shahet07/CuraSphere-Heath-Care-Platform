import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Doctor } from 'src/app/models/doctor';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
  selector: 'app-doctorlist',
  templateUrl: './doctorlist.component.html',
  styleUrls: ['./doctorlist.component.css']
})
export class DoctorlistComponent implements OnInit {

  doctors: Doctor[] = [];

  constructor(private _service : DoctorService) { }

  ngOnInit(): void
  {
    this._service.getDoctorList()
      .pipe(
        map((doctors: Doctor[]) =>
          (doctors || []).filter((doctor) =>
            !!doctor &&
            !!doctor.doctorname &&
            !!doctor.email &&
            doctor.status === 'accept'
          )
        )
      )
      .subscribe((doctors) => {
        this.doctors = doctors;
      });
  }

}
