import { Relation } from "../../enums/emergency.relation";

export interface PatientGrantor {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    relation?: string;
    idFront?: number[];
    idBack?: number[];
  }