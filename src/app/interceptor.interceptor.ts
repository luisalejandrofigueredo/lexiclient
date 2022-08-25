import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>,next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError((error) => this.errorHandler(error)));;
  }
   // Customize the default error handler here if needed
   private errorHandler(response: HttpErrorResponse): Observable < never > {
    if (!environment.production) {
      // Do something with the error
    }

    // console.error(error);
    const httpErrorCode = response.status;
    switch (httpErrorCode) {
      case 404:
        break;
      case 403:
        break;
      case 500:
      default:
        // 500 Error Handing
        console.log('Error',httpErrorCode);
        break;
    }
    throw response;
  }
}
