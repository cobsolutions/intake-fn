import { FormGroup, Validators } from "@angular/forms";
import { PhysicalTherapyFields } from "./physical.therapy.fields";

export class PhysicalTherapyValidator {
    public static addValidator(form: FormGroup) {
        form.get('medical')?.get('isReceivedPhysicalTherapy')?.valueChanges.subscribe((value: any) => {
            if (value === 'yes') {
                for (var i = 0; i < PhysicalTherapyFields.length; i++) {
                    form.get('medical')?.get(PhysicalTherapyFields[i])?.setValidators(Validators.required)
                    form.get('medical')?.get(PhysicalTherapyFields[i])?.updateValueAndValidity();
                }
            } else {
                for (var i = 0; i < PhysicalTherapyFields.length; i++) {
                    form.get('medical')?.get(PhysicalTherapyFields[i])?.clearValidators();
                    form.get('medical')?.get(PhysicalTherapyFields[i])?.setErrors(null);
                    form.get('medical')?.get(PhysicalTherapyFields[i])?.updateValueAndValidity();
                }
            }
        })
    }
}