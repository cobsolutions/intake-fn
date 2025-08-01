import { FormGroup } from "@angular/forms";
import { CompensationFields } from "./compensation.fields";

export class RemoveWorkerCompensationValidators {
    public static remove(form: FormGroup) {
        for (var i = 0; i < CompensationFields.length; i++) {
            form.get('insurance')?.get(CompensationFields[i])?.clearValidators();
            form.get('insurance')?.get(CompensationFields[i])?.setErrors(null);
            form.get('insurance')?.get(CompensationFields[i])?.updateValueAndValidity();
        }

    }
}