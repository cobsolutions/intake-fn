export interface PatientSearchCriteria {
    name?: string;
    phone?: string;
    email?: string;
    insuranceCompany?: string;
    provider?: string;
    clinic?: String;
    startDate_date?: Date | null | undefined
    endDate_date?: Date | null | undefined
    isSchedule?:boolean | null
    startDate?:number
    endDate?:number
    timeZone?:string
    clinicId?:number| null
}