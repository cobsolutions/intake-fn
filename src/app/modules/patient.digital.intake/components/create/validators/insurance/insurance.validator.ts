import { FormGroup } from "@angular/forms";
import { AddCommercialValidators } from "./commercial/add.commercial.validator";
import { RemoveCommercialMedicareCoverageValidator } from "./commercial/remove.commercial.medicare.coverage.validator";
import { RemoveCommercialPloicyHolderRelationshipValidator } from "./commercial/remove.commercial.ploicy.holderRelationship.validator";
import { RemoveCommercialSecondaryInsuranceValidator } from "./commercial/remove.commercial.secondary.insurance.validator";
import { RemoveCommercialValidators } from "./commercial/remove.commercial.validator";
import { AddWorkerCompensationValidators } from "./compensation/add.worker.compensation.validators";
import { RemoveWorkerCompensationValidators } from "./compensation/remove.worker.compensation.validators";

export class InsuranceValidator {
    public static addValidator(form: FormGroup) {
        AddCommercialValidators.add(form)
        form.get('insurance')?.get('type')?.valueChanges.subscribe((value: any) => {
            console.log(value)
            if (value === 'Worker\'s Compensation') {
                //add worker compansation validators 
                AddWorkerCompensationValidators.add(form)
                //remove worker commercial validators
                RemoveCommercialValidators.remove(form)
                RemoveCommercialSecondaryInsuranceValidator.remove(form);
                RemoveCommercialMedicareCoverageValidator.remove(form);
                RemoveCommercialPloicyHolderRelationshipValidator.remove(form);
            }
            if (value === 'Commercial Insurance') {
                //add commercial validators
                AddCommercialValidators.add(form);
                //remove worker compansation validators
                RemoveWorkerCompensationValidators.remove(form)
            }
            if (value === 'Medicare') {

            }
            if (value === 'Medicaid') {

            }
        })
    }
}