import { FormGroup } from "@angular/forms";
import { AddEntityValidator } from "./entity/add.entity.validator";
import { RemoveEntityValidator } from "./entity/remove.entity.validator";
import { AddProviderSourceValidator } from "./provider/add.provider.validator";
import { RemoveProviderValidator } from "./provider/remove.provider.validator";

export class PatientSourceValidator {
    public static addValidator(form: FormGroup) {
        form.get('medical')?.get('referringEntity')?.valueChanges.subscribe(value => {
            if (value === 'referringDoctor') {
                AddProviderSourceValidator.add(form);
            }else{
                RemoveProviderValidator.remove(form)
            }
        })
    }
}