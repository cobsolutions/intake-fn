import { FormGroup, Validators } from "@angular/forms";
import { imageDocumentValidator } from "../../custom.validation/document.image.validator";
import { PatientDocumentFields } from "./patient.document.fields";

export class AddPatientValidator{
    public static add(form: FormGroup) {
        for (var i = 0; i < PatientDocumentFields.length; i++) {
            form.get('document')?.get(PatientDocumentFields[i])?.setValidators([Validators.required,imageDocumentValidator()])
            form.get('document')?.get(PatientDocumentFields[i])?.updateValueAndValidity();
        }
    }
}