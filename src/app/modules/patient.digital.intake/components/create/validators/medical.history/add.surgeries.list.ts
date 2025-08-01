import { FormGroup, Validators } from "@angular/forms";
import { SurgerisListFields } from "./surgeris.list.fields";

export class AddSurgerisListValidator {
    public static addValidator(form: FormGroup) {
        form.get('medicalhistory')?.get('surgeriesList')?.valueChanges.subscribe((value: any) => {
            if (value === 'yes') {
                for (var i = 0; i < SurgerisListFields.length; i++) {
                    form.get('medicalhistory')?.get(SurgerisListFields[i])?.setValidators(Validators.required)
                    form.get('medicalhistory')?.get(SurgerisListFields[i])?.updateValueAndValidity();
                }
            } else {
                for (var i = 0; i < SurgerisListFields.length; i++) {
                    form.get('medicalhistory')?.get(SurgerisListFields[i])?.clearValidators();
                    form.get('medicalhistory')?.get(SurgerisListFields[i])?.setErrors(null);
                    form.get('medicalhistory')?.get(SurgerisListFields[i])?.updateValueAndValidity();
                }
            }
        })
    }

}