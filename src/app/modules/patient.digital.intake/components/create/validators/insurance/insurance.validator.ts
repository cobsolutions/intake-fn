import { FormGroup, Validators } from "@angular/forms";
import { noSpecialCharactersValidator } from "../custom.validation/special.characters.validator";
import { AddCommercialValidators } from "./commercial/add.commercial.validator";
import { AddMedicaidValidators } from "./commercial/add.medicaid.validator";
import { AddMedicareValidators } from "./commercial/add.medicare.validator";
import { RemoveCommercialPloicyHolderRelationshipValidator } from "./commercial/remove.commercial.ploicy.holderRelationship.validator";
import { RemoveCommercialSecondaryInsuranceValidator } from "./commercial/remove.commercial.secondary.insurance.validator";
import { RemoveCommercialValidators } from "./commercial/remove.commercial.validator";
import { RemoveMedicaidValidators } from "./commercial/remove.medicaid.validators";
import { RemoveMedicareValidators } from "./commercial/remove.medicare.validators";
import { AddWorkerCompensationValidators } from "./compensation/add.worker.compensation.validators";
import { RemoveWorkerCompensationValidators } from "./compensation/remove.worker.compensation.validators";

export class InsuranceValidator {
    public static clearValidator(form: FormGroup) {
        form.get('insurance')?.get('type')?.clearValidators();
        form.get('insurance')?.get('type')?.setErrors(null);
        form.get('insurance')?.get('type')?.updateValueAndValidity();
        RemoveCommercialValidators.remove(form)
        RemoveCommercialSecondaryInsuranceValidator.remove(form);
        RemoveCommercialPloicyHolderRelationshipValidator.remove(form);
        RemoveWorkerCompensationValidators.remove(form);
        RemoveMedicareValidators.remove(form);
        RemoveMedicaidValidators.remove(form);
    }
    public static addValidator(form: FormGroup) {
        AddCommercialValidators.add(form)
        form.get('insurance')?.get('type')?.valueChanges.subscribe((value: any) => {
            if (value === 'Worker\'s Compensation') {
                this.removeAutoAccident(form)
                //add worker compansation validators 
                AddWorkerCompensationValidators.add(form)
                //remove worker commercial validators
                RemoveCommercialValidators.remove(form)
                RemoveCommercialSecondaryInsuranceValidator.remove(form);
                RemoveCommercialPloicyHolderRelationshipValidator.remove(form);
                RemoveMedicareValidators.remove(form);
                RemoveMedicaidValidators.remove(form);
            }
            if (value === 'Auto Accident') {
                this.addAutoAccident(form)
                //add worker compansation validators 
                AddWorkerCompensationValidators.add(form)
                //remove worker commercial validators
                RemoveCommercialValidators.remove(form)
                RemoveCommercialSecondaryInsuranceValidator.remove(form);
                RemoveCommercialPloicyHolderRelationshipValidator.remove(form);
                RemoveMedicareValidators.remove(form);
                RemoveMedicaidValidators.remove(form);
            }
            if (value === 'Commercial Insurance') {
                //add commercial validators
                AddCommercialValidators.add(form);
                //remove worker compansation validators
                this.removeAutoAccident(form)
                RemoveWorkerCompensationValidators.remove(form)
                RemoveMedicareValidators.remove(form);
                RemoveMedicaidValidators.remove(form);
            }
            if (value === 'Medicare') {
                AddMedicareValidators.add(form);
                RemoveCommercialValidators.remove(form)
                RemoveCommercialSecondaryInsuranceValidator.remove(form);
                RemoveCommercialPloicyHolderRelationshipValidator.remove(form);
                this.removeAutoAccident(form)
                RemoveWorkerCompensationValidators.remove(form)
                RemoveMedicaidValidators.remove(form);
            }
            if (value === 'Medicaid') {
                AddMedicaidValidators.add(form)
                RemoveCommercialValidators.remove(form)
                RemoveCommercialSecondaryInsuranceValidator.remove(form);
                RemoveCommercialPloicyHolderRelationshipValidator.remove(form);
                this.removeAutoAccident(form)
                RemoveWorkerCompensationValidators.remove(form)
                RemoveMedicareValidators.remove(form);

            }
            if (value === 'SelfPay') {
                RemoveCommercialValidators.remove(form)
                RemoveCommercialSecondaryInsuranceValidator.remove(form);
                RemoveCommercialPloicyHolderRelationshipValidator.remove(form);
                this.removeAutoAccident(form)
                RemoveWorkerCompensationValidators.remove(form);
                RemoveMedicareValidators.remove(form);
                RemoveMedicaidValidators.remove(form);
            }
        })
    }
    private static addAutoAccident(form: FormGroup) {
        form.get('insurance')?.get('compensation-accident-date')?.setValidators([Validators.required])
        form.get('insurance')?.get('compensation-accident-date')?.updateValueAndValidity();
    }
    private static removeAutoAccident(form: FormGroup) {
        form.get('insurance')?.get('compensation-accident-date')?.clearValidators();
        form.get('insurance')?.get('compensation-accident-date')?.setErrors(null);
        form.get('insurance')?.get('compensation-accident-date')?.updateValueAndValidity();
    }
}