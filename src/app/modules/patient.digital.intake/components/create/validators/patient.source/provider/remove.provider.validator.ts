import { FormGroup, Validators } from "@angular/forms";
import { ProviderFields } from "./provider.fields";

export class RemoveProviderValidator {
    public static remove(form: FormGroup) {
        for (var i = 0; i < ProviderFields.length; i++) {
            form.get('medical')?.get(ProviderFields[i])?.clearValidators();
            form.get('medical')?.get(ProviderFields[i])?.setErrors(null);
            form.get('medical')?.get(ProviderFields[i])?.updateValueAndValidity();
        }
    }
}