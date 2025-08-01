import { FormGroup } from "@angular/forms";
import * as moment from "moment";
import { AddGuarantorValidators } from "./add.guarantor.validator";
import { RemoveGuarantorValidators } from "./remove.guarantor.validator";

export class GuarantorValidator {
    public static addValidator(form: FormGroup) {
        form.get('basic')?.get('dob')?.valueChanges.subscribe((value: any) => {
            var patientAge = moment().diff(value, 'y')
            var isGuarantor: boolean = patientAge < 18 ? true : false;
            if (isGuarantor) {
                AddGuarantorValidators.add(form);
            } else {
                RemoveGuarantorValidators.remove(form);
            }
        });
    }
}