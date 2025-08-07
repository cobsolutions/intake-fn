import { InsuranceType } from "./insurance.type";

export var insuranceTypes: InsuranceType[] = [
    {
        name:"Insurance (PPO, HMO, etc.)",
        value:"Commercial Insurance"
    },
    {
        name:"Worker’s Comp (Work Injury)",
        value:"Worker's Compensation"
    },
    {
        name:"No-Fault (Car Accident)",
        value:"Auto Accident"
    },
    {
        name:"Medicare",
        value:"Medicare"
    },
    {
        name:"Medicaid / Managed Plan",
        value:"Medicaid"
    },
    {
        name:"I’m paying out of pocket",
        value:"SelfPay"
    }
]