
import * as _ from 'lodash';
import { AddressInformation } from 'src/app/models/validation/new/address.information';
import { PatientAddress } from 'src/app/modules/patient.questionnaire/models/intake/essential/patienta.ddress';
import { PropertyValidator } from '../PropertyValidator';
import { ValidatorContainer } from '../ValidatorContainer';
import { PatientValidator } from './patient.validator';


export class PatientAddressValidator extends PatientValidator {
    pateintAddressInfo: PatientAddress;
    requiredFields: AddressInformation;
    constructor(requiredFields: AddressInformation, addressInfo: PatientAddress) {
        super();
        this.pateintAddressInfo = addressInfo
        this.requiredFields = requiredFields;
    }


    protected missingFields(validatorContainer: ValidatorContainer) {
        var validators: PropertyValidator[] = new Array();
        this.validateInfo(validators);
        if (validators.length > 0) {
            validatorContainer.isValid = false;
            _.forEach(validators, validator => {
                validatorContainer.missing.push(validator)
            });
        }
    }

    protected inCorrectDate(validatorContainer: ValidatorContainer) {

    }
    protected validateInfo(validator: PropertyValidator[]) {

        if (this.pateintAddressInfo.type === '' || this.pateintAddressInfo.type === undefined)
            validator.push({ property: " Address Type", message: '' });

        if (this.pateintAddressInfo.first === '' || this.pateintAddressInfo.first === undefined)
            validator.push({ property: "First Address", message: '' });

        if (this.isRequiredField('second')) {
            if (this.pateintAddressInfo.second === '' || this.pateintAddressInfo.second === undefined)
                validator.push({ property: "Second Address", message: '' });
        }

        if (this.pateintAddressInfo.state === '' || this.pateintAddressInfo.state === undefined)
            validator.push({ property: "State", message: '' });

        if (this.pateintAddressInfo.zipCode === '' || this.pateintAddressInfo.zipCode === undefined)
            validator.push({ property: " zipCode ", message: '' });

    }

    isRequiredField(name: string): boolean {
        var field: boolean = false;
        Object.entries(this.requiredFields)
            .forEach(([key, value]) => {
                if (key === name) {
                    field = value;
                }
            })
        return field;
    }

}