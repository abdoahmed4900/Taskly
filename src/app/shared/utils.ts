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
    if (value && /^[a-z]/) {
      control.setErrors({ ...control.errors, noLowerCase: true });
      return control.errors;
    } else {
      control.setErrors({ ...control.errors, noLowerCase: null });
    }
    return null;
  };
}
export function doesControlIncludeUpperCase(): ValidatorFn {
  return (control: AbstractControl) => {
    const value: string = control.value ?? '';
    if (value && /^[A-Z]/) {
      control.setErrors({ ...control.errors, noUpperCase: true });
      return control.errors;
    } else {
      control.setErrors({ ...control.errors, noUpperCase: null });
    }
    return null;
  };
}

export function passwordChecksMap(atLeast?: number, atMost?: number) {
  return {
    'at least': `At least ${atLeast} characters`,
    'at most': `At most ${atMost} characters`,
    '8-64': `${atLeast}-${atMost} characters`,
    uppercase: 'Uppercase letter',
    lowercase: 'Lowercase letter',
    digit: 'One digit',
    special: 'Special character',
  };
}
