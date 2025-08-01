import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function noSpecialCharactersValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = /[^a-zA-Z0-9 ]/g.test(control.value);
      return forbidden ? { noSpecialCharacters: true } : null;
    };
  }