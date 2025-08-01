import { FormGroup } from "@angular/forms";
import { PatientDocumentFields } from "./patient.document.fields";

export class RemovePatientValidator {
    public static remove(form: FormGroup) {
        for (var i = 0; i < PatientDocumentFields.length; i++) {
            form.get('document')?.get('0')?.get(PatientDocumentFields[i])?.clearValidators();
            form.get('document')?.get('0')?.get(PatientDocumentFields[i])?.setErrors(null);
            form.get('document')?.get('0')?.get(PatientDocumentFields[i])?.updateValueAndValidity();
        }
    }
}