export class PatientSearchCriteria {
    type: string |null | undefined = null;
    sourceType: string |null | undefined = null;
    entityNames: string[] | null;
    doctorName: string | null;
    doctorNPI: string |null;
    startDate_date: Date | null;
    endDate_date: Date | null;
    startDate: number | null;
    endDate: number | null;
    clinicId:number|null;
}