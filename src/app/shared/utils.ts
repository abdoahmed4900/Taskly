import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(
  passwordControl: string,
  confirmPasswordControl: string,
): ValidatorFn {
  return (control: AbstractControl) => {
    const password = control.get(passwordControl)?.value;
    const confirmPassword = control.get(confirmPasswordControl)?.value;

    if (password !== confirmPassword) {
      const errors: ValidationErrors = { passwordMismatch: true };
      control.get(confirmPasswordControl)?.setErrors(errors);
      return errors;
    } else {
      control.get(confirmPasswordControl)?.setErrors(null);
      return null;
    }
  };
}

export function controlMinLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl) => {
    const value: string = control.value ?? '';
    if (value.length < minLength) {
      const errors: ValidationErrors = { minLength: true };
      control.setErrors(errors);
      return errors;
    } else {
      control.setErrors(null);
      return null;
    }
  };
}

export function controlMaxLengthValidator(maxLength: number): ValidatorFn {
  return (control: AbstractControl) => {
    const value: string = control.value ?? '';
    if (value.length > maxLength) {
      const errors: ValidationErrors = { maxLength: true };
      control.setErrors(errors);
      return errors;
    } else {
      control.setErrors(null);
      return null;
    }
  };
}

export function emailValidator() {
  return (control: AbstractControl) => {
    const value: string = control.value;
    if (value && /^[\w-.]{2,30}@([\w-]{2,10}\.)+[\w-]{2,4}$/.test(value)) {
      control.setErrors({ ...control?.errors, emailInValid: null });
    } else {
      control?.setErrors({ ...control?.errors, emailInValid: true });
      return control.errors;
    }
    return null;
  };
}
export function doesControlIncludeSpecialCharacter() {
  return (control: AbstractControl) => {
    const value: string = control.value;
    if (value && /[^a-zA-Z0-9_ ]/.test(value)) {
      control.setErrors({ ...control?.errors, noSpecialChar: null });
    } else {
      control?.setErrors({ ...control?.errors, noSpecialChar: true });
      return control.errors;
    }
    return null;
  };
}

export function doesControlIncludeWhiteSpace(): ValidatorFn {
  return (control: AbstractControl) => {
    const value: string = control.value ?? '';
    if (value && value.includes(' ')) {
      control.setErrors({ ...control?.errors, whiteSpace: true });
      return control.errors;
    } else {
      control?.setErrors({ ...control?.errors, whiteSpace: null });
    }
    return null;
  };
}
export function doesNotControlIncludeWhiteSpace(): ValidatorFn {
  return (control: AbstractControl) => {
    const value: string = control.value ?? '';
    if (value && value.includes('  ')) {
      control.setErrors({ ...control?.errors, noWhiteSpace: true });
      return control.errors;
    } else {
      control?.setErrors({ ...control?.errors, noWhiteSpace: null });
    }
    return null;
  };
}

export function doesControlIncludeNumber(): ValidatorFn {
  return (control: AbstractControl) => {
    const value: string = control.value ?? '';
    if (value && /[0-9]/.test(value)) {
      control.setErrors({ ...control?.errors, hasNumber: null });
    } else {
      control?.setErrors({ ...control?.errors, hasNumber: true });
      return control.errors;
    }
    return null;
  };
}

export function doesControlIncludeLowerCase(): ValidatorFn {
  return (control: AbstractControl) => {
    const value: string = control.value ?? '';
    if (value && /[a-z]/.test(value)) {
      control.setErrors({ ...control.errors, noLowerCase: null });
    } else {
      control.setErrors({ ...control.errors, noLowerCase: true });
      return control.errors;
    }
    return null;
  };
}
export function doesControlIncludeUpperCase(): ValidatorFn {
  return (control: AbstractControl) => {
    const value: string = control.value ?? '';
    if (value && /[A-Z]/.test(value)) {
      control.setErrors({ ...control.errors, noUpperCase: null });
    } else {
      control.setErrors({ ...control.errors, noUpperCase: true });
      return control.errors;
    }
    return null;
  };
}
