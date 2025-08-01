import { FormGroup } from "@angular/forms";
import { CommercialPolicyHolderFields } from "./commercial.ploicy.holder.fields";

export class RemoveCommercialPloicyHolderRelationshipValidator{
    public static remove(form:FormGroup){
        for (var i = 0; i < CommercialPolicyHolderFields.length; i++) {
            form.get('insurance')?.get(CommercialPolicyHolderFields[i])?.clearValidators();
            form.get('insurance')?.get(CommercialPolicyHolderFields[i])?.setErrors(null);
            form.get('insurance')?.get(CommercialPolicyHolderFields[i])?.updateValueAndValidity();
        }
    }
}