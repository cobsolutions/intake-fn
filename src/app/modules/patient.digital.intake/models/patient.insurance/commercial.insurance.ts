import { MedicareCoverage } from "./medicare.coverage"
import { SecondaryInsurance } from "./secondary.snsurance"

export interface CommercialInsurance {
    insuranceCompanyName?: string
    insuranceCompanyId?: string
    memberId?: string
    policyId?: string
    policyRelationship?: string
    policyRelationshipFirstName?: string
    policyRelationshipMiddleName?: string
    policyRelationshipLastName?: string
    policyRelationshipPhone?: string
    isSecondaryInsurance?: boolean
    secondaryInsurance: SecondaryInsurance
    isMedicareCoverage?: boolean
    medicareCoverage: MedicareCoverage

}
