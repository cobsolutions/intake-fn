import { FormGroup, Validators } from "@angular/forms";
import { XrayFields } from "./xray.fields";



export class XRayValidator {
    public static addValidator(form: FormGroup) {
        form.get('medicalhistory')?.get('isXRay')?.valueChanges.subscribe((value: any) => {
            if (value === 'yes') {
                for (var i = 0; i < XrayFields.length; i++) {
                    form.get('medicalhistory')?.get(XrayFields[i])?.setValidators(Validators.required)
                    form.get('medicalhistory')?.get(XrayFields[i])?.updateValueAndValidity();
                }
            } else {
                for (var i = 0; i < XrayFields.length; i++) {
                    form.get('medicalhistory')?.get(XrayFields[i])?.clearValidators();
                    form.get('medicalhistory')?.get(XrayFields[i])?.setErrors(null);
                    form.get('medicalhistory')?.get(XrayFields[i])?.updateValueAndValidity();
                }
            }
        })
    }

}