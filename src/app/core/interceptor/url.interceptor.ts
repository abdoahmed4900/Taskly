import { environment } from './../../environments/environment';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

export function urlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const newReq = req.clone({
    url: `${environment.baseUrl}/${req.url}`,
    headers: req.headers.append('apikey', environment.apiKey),
  });
  return next(newReq);
}
