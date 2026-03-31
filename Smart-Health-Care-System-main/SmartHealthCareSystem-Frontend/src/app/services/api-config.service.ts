import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiConfigService {
  // Use absolute backend URL from environment to avoid relying on dev proxy for correctness.
  private readonly base = environment.apiURL; // e.g. http://localhost:8081
  url(path: string): string {
    // Ensure single slash join
    if (!path.startsWith('/')) path = '/' + path;
    return `${this.base}${path}`;
  }
}
