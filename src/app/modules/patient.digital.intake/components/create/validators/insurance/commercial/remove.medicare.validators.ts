import { FormGroup } from "@angular/forms";
import { MedicareFields } from "./medicare.fields";

export class RemoveMedicareValidators {
    public static remove(form: FormGroup) {
        for (var i = 0; i < MedicareFields.length; i++) {
            form.get('insurance')?.get(MedicareFields[i])?.clearValidators();
            form.get('insurance')?.get(MedicareFields[i])?.setErrors(null);
            form.get('insurance')?.get(MedicareFields[i])?.updateValueAndValidity();
        }
    }
}