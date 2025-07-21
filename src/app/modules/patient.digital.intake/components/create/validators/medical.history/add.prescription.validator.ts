import { FormGroup, Validators } from "@angular/forms";
import { PrescriptionFields } from "./prescription.fields";

export class PrescriptionValidator {
    public static addValidator(form: FormGroup) {
        form.get('medicalhistory')?.get('prescriptionMedication')?.valueChanges.subscribe((value: any) => {
            if (value === 'yes') {
                for (var i = 0; i < PrescriptionFields.length; i++) {
                    form.get('medicalhistory')?.get(PrescriptionFields[i])?.setValidators(Validators.required)
                    form.get('medicalhistory')?.get(PrescriptionFields[i])?.updateValueAndValidity();
                }
            } else {
                for (var i = 0; i < PrescriptionFields.length; i++) {
                    form.get('medicalhistory')?.get(PrescriptionFields[i])?.clearValidators();
                    form.get('medicalhistory')?.get(PrescriptionFields[i])?.setErrors(null);
                    form.get('medicalhistory')?.get(PrescriptionFields[i])?.updateValueAndValidity();
                }
            }
        })
    }
}