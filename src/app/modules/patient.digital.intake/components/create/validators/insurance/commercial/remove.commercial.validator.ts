import { FormGroup } from "@angular/forms";
import { CommercialFields } from "./commercial.fields";

export class RemoveCommercialValidators {
    public static remove(form: FormGroup) {
        for (var i = 0; i < CommercialFields.length; i++) {
            form.get('insurance')?.get(CommercialFields[i])?.clearValidators();
            form.get('insurance')?.get(CommercialFields[i])?.setErrors(null);
            form.get('insurance')?.get(CommercialFields[i])?.updateValueAndValidity();
        }
    }
}