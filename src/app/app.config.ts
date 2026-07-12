import { ApplicationConfig, forwardRef } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './core/interceptor/token.interceptor';
import { errorInterceptor } from './core/interceptor/error.interceptor';
import { urlInterceptor } from './core/interceptor/url.interceptor';
import { FormFieldComponent } from './features/auth/components/form-field/form-field.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DescriptionInputComponent } from './features/projects/add-project/components/description-input/description-input.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DescriptionInputComponent),
      multi: true,
    },
    provideHttpClient(withInterceptors([tokenInterceptor, errorInterceptor, urlInterceptor])),
  ],
};
