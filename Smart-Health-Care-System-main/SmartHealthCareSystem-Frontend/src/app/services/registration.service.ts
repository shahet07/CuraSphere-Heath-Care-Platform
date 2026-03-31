import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { Doctor } from '../models/doctor';
import { User } from '../models/user';
import { map } from "rxjs/operators";

// Endpoints will be prefixed with /api through proxy

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  user = new User();
  doctor = new Doctor();

  constructor(private _http : HttpClient, private api: ApiConfigService) { }

public registerUserFromRemote(user : User):Observable<any>
{
  return this._http.post<any>(this.api.url('/registeruser'),user)
}

public registerDoctorFromRemote(doctor : Doctor):Observable<any>
{
  return this._http.post<any>(this.api.url('/registerdoctor'),doctor)
}

}
