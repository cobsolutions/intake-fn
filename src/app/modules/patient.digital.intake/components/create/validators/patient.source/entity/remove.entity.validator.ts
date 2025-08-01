import { FormGroup } from "@angular/forms";
import { EntityFields } from "./entity.fields";

export class RemoveEntityValidator{
    public static remove(form:FormGroup){
        for (var i = 0; i < EntityFields.length; i++) {
            form.get('medical')?.get(EntityFields[i])?.clearValidators();
            form.get('medical')?.get(EntityFields[i])?.setErrors(null);
            form.get('medical')?.get(EntityFields[i])?.updateValueAndValidity();
        }
        
    }
}