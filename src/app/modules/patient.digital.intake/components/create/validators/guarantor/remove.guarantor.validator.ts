import { FormGroup } from "@angular/forms";
import { CompensationFields } from "../insurance/compensation/compensation.fields";
import { GuarantorFields } from "./guarantor.fields";

export class RemoveGuarantorValidators{
    public static remove(form: FormGroup) {
        for (var i = 0; i < GuarantorFields.length; i++) {
            form.get('basic')?.get(GuarantorFields[i])?.clearValidators();
            form.get('basic')?.get(GuarantorFields[i])?.setErrors(null);
            form.get('basic')?.get(GuarantorFields[i])?.updateValueAndValidity();
        }

    }
}