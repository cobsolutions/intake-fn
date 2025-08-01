import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import * as moment from "moment";

export function futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const forbidden = moment(control.value).isAfter(moment(), 'day');
        return forbidden ? { future: true } : null;
    };
}