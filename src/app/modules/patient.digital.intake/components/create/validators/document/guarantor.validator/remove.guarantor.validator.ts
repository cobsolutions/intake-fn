import { FormGroup } from "@angular/forms";
import { GuarantorDocumentFields } from "./guarantor.document.fields";

export class RemoveGuarantorValidator{
    public static remove(form: FormGroup) {
        for (var i = 0; i < GuarantorDocumentFields.length; i++) {
            form.get('document')?.get('1')?.get(GuarantorDocumentFields[i])?.clearValidators();
            form.get('document')?.get('1')?.get(GuarantorDocumentFields[i])?.setErrors(null);
            form.get('document')?.get('1')?.get(GuarantorDocumentFields[i])?.updateValueAndValidity();
        }
    }
}