import { Relation } from "src/app/modules/patient.questionnaire/enums/emergency.relation";


export class PateintGrantorModel {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    relation: Relation | null = null;
    files: FormData = new FormData()
}