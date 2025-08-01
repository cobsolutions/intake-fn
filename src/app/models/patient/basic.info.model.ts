
import { Relation } from "src/app/modules/patient.questionnaire/enums/emergency.relation";
import { PateintGrantorModel } from "./patient.grantor.model";

export class Basic {
    firstName: string = '';
    middleName: string = '';
    lastName: string = '';
    birthDate_date: Date;
    birthDate: number = 0;
    gender: string = '';
    maritalStatus: string = '';
    phoneType: string = '';
    phoneNumber: string = '';
    email: string = '';
    //idType: string = '';
    //patientId: string = '';
    // id_effective_from_date = new Date();
    // idEffectiveFrom: number = 0;
    // id_effective_to_date = new Date();
    // idEffectiveTo: number = 0;
    emergencyName: string = '';
    emergencyRelation:Relation | null = null;
    emergencyPhone: string = '';
    employmentStatus: string = '';
    employmentCompany :string = ''
    pateintGrantor:PateintGrantorModel = new PateintGrantorModel();

}
