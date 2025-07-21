import { FormGroup, Validators } from "@angular/forms";
import { MedicareFields } from "./medicare.fields";

export class AddMedicareValidators {
    public static add(form: FormGroup) {
        for (var i = 0; i < MedicareFields.length; i++) {
            form.get('insurance')?.get(MedicareFields[i])?.setValidators(Validators.required)
            form.get('insurance')?.get(MedicareFields[i])?.updateValueAndValidity();
        }
    }
}