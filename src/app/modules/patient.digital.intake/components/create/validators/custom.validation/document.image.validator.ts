import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function imageDocumentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {        
            const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
            if(control?.value){
                const extension = control?.value?.split('.').pop().toLowerCase();
                return !validExtensions.includes(extension) ? { imageFile: true } : null;
            }
        return null;
    };
}