export interface PatientAgreement {
  acceptReleaseAgreements?: boolean
  acceptFinancialResponsibilityAgreements?: boolean
  acceptFinancialAgreementAgreements?: boolean
  acceptInsuranceAgreement?: boolean
  acceptHIPAAAgreements?: boolean
  cancellationPolicyAgreements?:boolean
  communicationAttestationAgreements?:boolean
  authorizationToReleaseObtainInformationAgreements?:boolean
  consentToTreatmentAgreements?:boolean
  noticeOfPrivacyPracticesAgreements?:boolean
  insuranceEligibilityAgreements?:boolean
  assignmentReleaseOfBenefitsAgreements?:boolean
  acceptCuppingAgreements?: boolean
  acceptPelvicAgreements?: boolean
  acceptPhotoVideoAgreements?: boolean
}