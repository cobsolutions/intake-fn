import * as _ from "lodash";
import { PatientValidator } from "./patient.validator/patient.validator";
import { PropertyValidator } from "./PropertyValidator";
import { ValidatorContainer } from "./ValidatorContainer";

export class PateintFilesValidator extends PatientValidator {
    imageFormData: FormData;
    fileNames: string[] = ['pIdfront', 'pIdback', 'pinsurancefront', 'pinsuranceback']

    constructor(imageFormData: FormData) {
        super();
        this.imageFormData = imageFormData

    }
    protected missingFields(validatorContainer: ValidatorContainer): void {
        var validators: PropertyValidator[] = new Array();
        this.validateInfo(validators);
        if (validators.length > 0) {
            validatorContainer.isValid = false;
            _.forEach(validators, validator => {
                validatorContainer.missing.push(validator)
            });
        }
    }
    protected inCorrectDate(validatorContainer: ValidatorContainer): void {

    }
    protected validateInfo(validator: PropertyValidator[]): void {
        var uploadedFiles: string[] = new Array();
        for (var pair of this.imageFormData.entries()) {
            uploadedFiles.push((<File>pair[1]).name.split(':')[1])
        }
        if (!this.imageFormData.has('files'))
            validator.push({ property: " All Files are missed ", message: '' });
    }
    protected isRequiredField(name: string): boolean {
        return true;
    }

}