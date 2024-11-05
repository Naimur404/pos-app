import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private apiUrl = environment.apiUrl;
  private version = environment.version;
  private timeout = environment.timeout;

  constructor() {}

  getApiUrl(): string {
    return this.apiUrl;
  }

  getFullUrl(endpoint: string): string {
    // Remove leading slash if present to avoid double slashes
    endpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.apiUrl}/${endpoint}`;
  }

  getVersion(): string {
    return this.version;
  }

  getTimeout(): number {
    return this.timeout;
  }
}
