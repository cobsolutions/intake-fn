
import * as _ from 'lodash';
import { MedicalInformation } from 'src/app/models/validation/new/medical.information';
import { PatientMedical } from 'src/app/modules/patient.questionnaire/models/intake/medical/patient.medical';
import { PatientSource } from 'src/app/modules/patient.questionnaire/models/intake/source/patient.source';
import { PropertyValidator } from '../PropertyValidator';
import { ValidatorContainer } from '../ValidatorContainer';
import { PatientValidator } from './patient.validator';


export class PatientMedicalQuestionnaireValidator extends PatientValidator {
    medicalQuestionnaireInfo: PatientMedical;
    patientSource: PatientSource
    requiredFields: MedicalInformation;

    constructor(medicalQuestionnaireInfo: PatientMedical, patientSource: PatientSource,
        requiredFields: MedicalInformation) {
        super();
        this.medicalQuestionnaireInfo = medicalQuestionnaireInfo;
        this.requiredFields = requiredFields;
        this.patientSource = patientSource;
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
    private validateRecommendationDoctor(validator: PropertyValidator[]) {
        if (this.patientSource.doctorSource !== undefined) {
            if (this.isRequiredField('recommendedDoctorName')) {
                if (this.patientSource.doctorSource.doctorName === '' || this.patientSource.doctorSource.doctorName === undefined)
                    validator.push({ property: " Recommendation Doctor name", message: '' });
            }
            if (this.isRequiredField('recommendedDoctorNpi')) {
                if (this.patientSource.doctorSource.doctorNPI === '' || this.patientSource.doctorSource.doctorNPI === undefined)
                    validator.push({ property: " Recommendation Doctor NPI", message: '' });
            }
        }
    }

    private validateRecommendationEntity(validator: PropertyValidator[]) {
        if (this.patientSource.entitySource?.organizationName === '' || this.patientSource.entitySource?.organizationName === undefined)
            validator.push({ property: "Other Resource ", message: '' });
    }

    private validatephysicalTherapyReceiving(validator: PropertyValidator[]) {
        if (this.medicalQuestionnaireInfo.patientPhysicalTherapy?.location === '' || this.medicalQuestionnaireInfo.patientPhysicalTherapy?.location === undefined)
            validator.push({ property: "Location of physical therapy", message: '' });

        if (this.medicalQuestionnaireInfo.patientPhysicalTherapy?.numberOfVisit === 0 || this.medicalQuestionnaireInfo.patientPhysicalTherapy?.numberOfVisit === undefined)
            validator.push({ property: "Number of visits of physical therapy", message: '' });
    }
    protected validateInfo(validator: PropertyValidator[]) {
        if (this.patientSource.doctorSource === undefined && this.patientSource.entitySource === undefined)
            validator.push({ property: "Mandatory: Did the primary doctor/Referring doctor refer you to us or mention our clinics?", message: '' });
        if (this.patientSource.doctorSource !== undefined)
            this.validateRecommendationDoctor(validator);
        else if (this.patientSource.entitySource !== undefined)
            this.validateRecommendationEntity(validator);

        if (this.medicalQuestionnaireInfo.hasPatientPhysicalTherapy === undefined)
            validator.push({ property: "Mandatroy : Have you received physical therapy?", message: '' });
        if (this.medicalQuestionnaireInfo.patientPhysicalTherapy !== undefined)
            this.validatephysicalTherapyReceiving(validator);

        //if (this.isRequiredField('appointmentBooking')) {
        if (this.medicalQuestionnaireInfo.appointmentBooking === '' || this.medicalQuestionnaireInfo.appointmentBooking === undefined)
            validator.push({ property: "Mandatory : How did you book your appointment?", message: '' });
        //}
        if (this.isRequiredField('primaryDoctor')) {
            if (this.medicalQuestionnaireInfo.primaryDoctor === '' || this.medicalQuestionnaireInfo.primaryDoctor === undefined)
                validator.push({ property: "Primary Doctor", message: '' });
        }
        // if (this.isRequiredField('resultSubmissionFamily')) {
        // if (this.medicalQuestionnaireInfo.familyResultSubmission === undefined)
        //     validator.push({ property: "Mandatory : Would you like your results sent to your family doctor?", message: '' });
        //}
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