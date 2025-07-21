import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function noNumbersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = /[0-9]/.test(control.value); // Checks if the input contains any number
    return forbidden ? { noNumbers: true } : null;
  };
}
