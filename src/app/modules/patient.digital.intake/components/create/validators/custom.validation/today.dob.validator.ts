import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import * as moment from "moment";

export function todayDOBValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const forbidden = moment(control.value).isSame(moment(), 'day');
        return forbidden ? { today: true } : null;
    };
}