export interface PatientMedicalHistory {
    height?: number,
    heightUnit?: string,
    weight?: number,
    weightUnit?: string,
    evaluationReason?: string,
    medicationPrescription?: string,
    condition?: string[]
    xRay?: string
    isMetalImplants?: boolean,
    isPacemaker: boolean,
    surgeriesList?:string
}