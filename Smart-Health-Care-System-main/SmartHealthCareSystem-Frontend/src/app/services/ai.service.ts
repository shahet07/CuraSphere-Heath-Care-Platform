import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AIInsightsRequest, AIInsightsResponse } from '../models/ai';

const NAV_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class AiService {

  constructor(private http: HttpClient) { }

  generateInsights(payload: AIInsightsRequest): Observable<AIInsightsResponse> {
    return this.http.post<AIInsightsResponse>(`${NAV_URL}/ai/insights`, payload);
  }
}
