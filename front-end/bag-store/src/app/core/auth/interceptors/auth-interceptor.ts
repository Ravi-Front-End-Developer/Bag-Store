import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/authService.service';
import { Router } from '@angular/router';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { ToastService } from '../../services/toastService.service';
import { environment } from 'src/environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let authRequest: HttpRequest<any> = req;
  const router = inject(Router);
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  // const modalCtrlService = inject(modalCtrl);
  // authService.getToken().then((token) => {
  //   if (token) {
  //     authRequest = req.clone({
  //       headers: req.headers.set('Authorization', `Bearer ${token}`),
  //     });
  //   }
  // });
  // 1. Wrap the Promise in 'from' to make it an Observable
  return from(authService.getToken()).pipe(
    switchMap((token) => {
      let authRequest = req;

      // 2. Clone the request INSIDE the switchMap
      if(authRequest.url.includes(environment.locationBaseURL)){
        return next(authRequest);
      }
      if (token) {
        authRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // 3. Pass the cloned request to the next handler
      return next(authRequest);
    }),
    // return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';
      if (error.error instanceof ErrorEvent) {
        // Client-side or network error (e.g., net::ERR_CONNECTION_REFUSED)
        errorMessage = `Error: ${error.error.message}`;
        // modalCtrlService.showModal(errorMessage, 'Error');
      } else {
        // Backend returned an unsuccessful response code
        switch (error.status) {
          case 401: // Unauthorized
            errorMessage = 'Session expired. Please login again.';
            toastService.presentToast(errorMessage, 'bottom');
            // authService.logout(); // Clear the local stateless token
            router.navigate(['auth/login']);
            break;
          case 403: // Forbidden
            errorMessage =
              'You do not have permission to access this resource.';
            // modalCtrlService.showModal(errorMessage, 'Error');
            // router.navigate(['/unauthorized']);
            break;
          case 500: // Internal Server Error
            errorMessage = 'Server side error. Please try again later.';
            // modalCtrlService.showModal(errorMessage, 'Error');
            break;
          case 0: // Often happens with net::ERR_CONNECTION_REFUSED
            errorMessage = 'The server is unreachable. Check your connection.';
            // modalCtrlService.showModal(errorMessage, 'Error');
            break;
        }
      }

      // Centralized Logging: You could send this to a logging service here
      console.error(`[Global Error Handler]: ${errorMessage}`, error);

      // Return the error so the calling component can still handle it if needed
      return throwError(() => error);
      // return throwError(() => new Error(errorMessage));
    }),
  );
};
