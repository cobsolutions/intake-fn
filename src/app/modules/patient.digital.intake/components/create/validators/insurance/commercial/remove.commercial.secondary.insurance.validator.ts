import { FormGroup } from "@angular/forms";
import { CommercialSecondaryInsuranceFields } from "./commercial.secondary.insurance.fields";

export class RemoveCommercialSecondaryInsuranceValidator{

    public static remove(form: FormGroup){
        for (var i = 0; i < CommercialSecondaryInsuranceFields.length; i++) {
            form.get('insurance')?.get(CommercialSecondaryInsuranceFields[i])?.clearValidators();
            form.get('insurance')?.get(CommercialSecondaryInsuranceFields[i])?.setErrors(null);
            form.get('insurance')?.get(CommercialSecondaryInsuranceFields[i])?.updateValueAndValidity();
        }
    }
}