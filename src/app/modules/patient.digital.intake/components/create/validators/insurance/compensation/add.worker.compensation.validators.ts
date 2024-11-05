import { FormGroup, Validators } from "@angular/forms";
import { futureDateValidator } from "../../custom.validation/future.date.validator";
import { noSpecialCharactersValidator } from "../../custom.validation/special.characters.validator";
import { CompensationFields } from "./compensation.fields";

export class AddWorkerCompensationValidators {
    public static add(form: FormGroup) {
        const phoneRgx = new RegExp("^[\+]?[0-9]{0,3}\W?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)][-\s\.]?[0-9]{4,6}$");
        const zipCodeRgx = new RegExp("^\\d{5}(?:[-\s]\\d{4})?$");
        for (var i = 0; i < CompensationFields.length; i++) {
            form.get('insurance')?.get(CompensationFields[i])?.setValidators(Validators.required)
            if (CompensationFields[i] === 'compensation-adjuster-phone'
                || CompensationFields[i] === 'compensation-attorney-phone') {
                form.get('insurance')?.get(CompensationFields[i])?.setValidators([Validators.pattern(phoneRgx)])
            }
            if (CompensationFields[i] === 'compensation-accident-date') {
                form.get('insurance')?.get(CompensationFields[i])?.addValidators([futureDateValidator()])
            }
            if (CompensationFields[i] === 'compensation-attorney-first-name') {
                form.get('insurance')?.get(CompensationFields[i])?.addValidators([noSpecialCharactersValidator()])
            }
            if (CompensationFields[i] === 'compensation-attorney-middle-name') {
                form.get('insurance')?.get(CompensationFields[i])?.addValidators([noSpecialCharactersValidator()])
            }
            if (CompensationFields[i] === 'compensation-attorney-last-name') {
                form.get('insurance')?.get(CompensationFields[i])?.addValidators([noSpecialCharactersValidator()])
            }
            if (CompensationFields[i] === 'compensation-adjuster-first-name') {
                form.get('insurance')?.get(CompensationFields[i])?.addValidators([noSpecialCharactersValidator()])
            }
            if (CompensationFields[i] === 'compensation-adjuster-middle-name') {
                form.get('insurance')?.get(CompensationFields[i])?.addValidators([noSpecialCharactersValidator()])
            }
            if (CompensationFields[i] === 'compensation-adjuster-last-name') {
                form.get('insurance')?.get(CompensationFields[i])?.addValidators([noSpecialCharactersValidator()])
            }
            form.get('insurance')?.get(CompensationFields[i])?.updateValueAndValidity();
        }
    }
}