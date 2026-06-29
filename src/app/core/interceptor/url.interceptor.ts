import { apiKey, baseUrl } from './../../env/environment';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

export function urlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const newReq = req.clone({
    url: `${baseUrl}/${req.url}`,
    headers: req.headers.append('apikey', apiKey),
  });
  return next(newReq);
}
