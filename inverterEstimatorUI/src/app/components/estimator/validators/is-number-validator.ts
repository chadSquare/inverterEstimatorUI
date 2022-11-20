import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function isNumberValidator(): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {
    return isNaN(control.value) ? {passwordStrength:true}: null;
  }
}
