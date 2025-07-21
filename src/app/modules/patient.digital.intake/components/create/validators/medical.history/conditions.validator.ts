import { FormGroup, Validators } from "@angular/forms";
import { ConditionsFields } from "./conditions.fields";

export class ConditionsValidator {
    public static addValidator(form: FormGroup) {
        form.get('medicalhistory')?.get('patientConditions')?.valueChanges.subscribe((value: any) => {
            if (value === 'yes') {
                for (var i = 0; i < ConditionsFields.length; i++) {
                    form.get('medicalhistory')?.get(ConditionsFields[i])?.setValidators(Validators.required)
                    form.get('medicalhistory')?.get(ConditionsFields[i])?.updateValueAndValidity();
                }
            } else {
                for (var i = 0; i < ConditionsFields.length; i++) {
                    form.get('medicalhistory')?.get(ConditionsFields[i])?.clearValidators();
                    form.get('medicalhistory')?.get(ConditionsFields[i])?.setErrors(null);
                    form.get('medicalhistory')?.get(ConditionsFields[i])?.updateValueAndValidity();
                }
            }
        })
    }
}