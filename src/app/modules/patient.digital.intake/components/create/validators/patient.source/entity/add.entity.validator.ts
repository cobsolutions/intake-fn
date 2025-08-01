import { FormGroup, Validators } from "@angular/forms";
import { EntityFields } from "./entity.fields";

export class AddEntityValidator{
    public static add(form:FormGroup){
        for (var i = 0; i < EntityFields.length; i++) {
            form.get('medical')?.get(EntityFields[i])?.setValidators(Validators.required)
            form.get('medical')?.get(EntityFields[i])?.updateValueAndValidity();
        }
    }
}