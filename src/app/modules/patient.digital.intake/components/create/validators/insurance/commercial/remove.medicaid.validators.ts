import { FormGroup } from "@angular/forms";
import { MedicaidFields } from "./medicaid.fields";

export class RemoveMedicaidValidators {
    public static remove(form: FormGroup) {
        for (var i = 0; i < MedicaidFields.length; i++) {
            form.get('insurance')?.get(MedicaidFields[i])?.clearValidators();
            form.get('insurance')?.get(MedicaidFields[i])?.setErrors(null);
            form.get('insurance')?.get(MedicaidFields[i])?.updateValueAndValidity();
        }
    }
}