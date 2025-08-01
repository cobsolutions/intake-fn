import { FormGroup, Validators } from "@angular/forms";
import { ProviderFields } from "./provider.fields";

export class AddProviderSourceValidator{
    public static add(form: FormGroup) {
        for (var i = 0; i < ProviderFields.length; i++) {
            form.get('medical')?.get(ProviderFields[i])?.setValidators(Validators.required)
            form.get('medical')?.get(ProviderFields[i])?.updateValueAndValidity();
        }
    }
}