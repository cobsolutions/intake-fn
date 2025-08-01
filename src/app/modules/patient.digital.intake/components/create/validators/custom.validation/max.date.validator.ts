import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import * as moment from "moment";

export function maxDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const currentDate = moment();
        const maxDate = currentDate.subtract(100, 'years');
        const forbidden = moment(control.value).isBefore(maxDate);
        return forbidden ? { max: true } : null;
    };
}