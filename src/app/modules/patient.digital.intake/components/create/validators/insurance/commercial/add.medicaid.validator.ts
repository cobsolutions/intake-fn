import { FormGroup, Validators } from "@angular/forms";
import { MedicaidFields } from "./medicaid.fields";
export class AddMedicaidValidators {
    public static add(form: FormGroup) {
        for (var i = 0; i < MedicaidFields.length; i++) {
            form.get('insurance')?.get(MedicaidFields[i])?.setValidators(Validators.required)
            form.get('insurance')?.get(MedicaidFields[i])?.updateValueAndValidity();
        }
    }
}