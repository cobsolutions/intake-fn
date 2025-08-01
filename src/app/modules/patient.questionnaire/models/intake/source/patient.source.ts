import { DoctorSource } from "./doctor.source";
import { EntitySource } from "./entity.source";

export interface PatientSource {
    doctorSource?: DoctorSource;
    entitySource?: EntitySource;
  }
  