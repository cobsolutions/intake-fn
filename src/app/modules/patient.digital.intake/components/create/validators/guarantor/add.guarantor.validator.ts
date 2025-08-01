import { FormGroup, Validators } from "@angular/forms";
import { noNumbersValidator } from "../custom.validation/no.number.validator";
import { noSpecialCharactersValidator } from "../custom.validation/special.characters.validator";
import { GuarantorFields } from "./guarantor.fields";

export class AddGuarantorValidators {
    public static add(form: FormGroup) {
        for (var i = 0; i < GuarantorFields.length; i++) {
            form.get('basic')?.get(GuarantorFields[i])?.setValidators([Validators.required,noSpecialCharactersValidator(),noNumbersValidator()])
            form.get('basic')?.get(GuarantorFields[i])?.updateValueAndValidity();
        }
        
    }
}