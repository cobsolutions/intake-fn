import { IPatientCondition } from "../patient.condition"

export class PatientConditions{
    public static create():IPatientCondition[] {
        
        return   [{
            name: "Alzheimer's",
            selected: false
          }, {
            name: "Cardiovascular Disease",
            selected: false
          },
          {
            name: "Cauda Equina Syndrome",
            selected: false
          }, {
            name: "Cerebral Vascular Accident",
            selected: false
          }, {
            name: "Current Infection",
            selected: false
          }, {
            name: "Diabetes Mellitus Type 1",
            selected: false
          }, {
            name: "Diabetes Mellitus Type 2",
            selected: false
          }, {
            name: "Fibromyalgia",
            selected: false
          }, {
            name: "Fracture",
            selected: false
          }, {
            name: "History of Cancer",
            selected: false
          },
          {
            name: "Huntington's",
            selected: false
          }, {
            name: "Immunosuppression",
            selected: false
          }, {
            name: "Lupus",
            selected: false
          }, {
            name: "Muscular Dystrophy",
            selected: false
          }, {
            name: "Parkinson's",
            selected: false
          }, {
            name: "Obesity",
            selected: false
          }, {
            name: "Osteoarthritis",
            selected: false
          },
          {
            name: "Rheumatoid Arthritis",
            selected: false
          },
          {
            name: "Traumatic Brain Injury",
            selected: false
          }
          ]
      }
}