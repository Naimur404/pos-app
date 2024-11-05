import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { ApiConfigService } from '../services/api-config.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private apiConfigService: ApiConfigService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Only modify requests going to our API
    if (request.url.includes(this.apiConfigService.getApiUrl())) {
      const modifiedRequest = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Api-Version': this.apiConfigService.getVersion(),
          // Add any other common headers here
        }
      });

      return next.handle(modifiedRequest).pipe(
        timeout(this.apiConfigService.getTimeout())
      );
    }

    return next.handle(request);
  }
}
