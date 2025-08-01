import { AddressInformation } from "./address.information"
import { EssentialInformation } from "./essential.information"
import { InsuranceCommercialInformation } from "./insurance.commercial.information"
import { InsuranceCompensationInformation } from "./insurance.compensation.information"
import { MedicalHistoryInformation } from "./medical.history.information"
import { MedicalInformation } from "./medical.information"

export interface PatientField {
    essentialInformation?: EssentialInformation
    addressInformation?: AddressInformation
    medicalInformation?: MedicalInformation
    medicalHistoryInformation?: MedicalHistoryInformation
    insuranceCompensationInformation?: InsuranceCompensationInformation
    insuranceCommercialInformation?: InsuranceCommercialInformation
    clinicId?: number
}