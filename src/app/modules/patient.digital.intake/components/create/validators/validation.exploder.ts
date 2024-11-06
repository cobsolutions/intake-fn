import { FormGroup } from "@angular/forms";

export class ValidationExploder {
    public static explode(form: FormGroup, formName: string) {
        var basicForm: FormGroup = form.get(formName)?.get('0') as FormGroup;
        Object.keys(basicForm.controls).forEach(field => {
            const control = basicForm.get(field);
            control?.markAsTouched({ onlySelf: true });
        });
        this.scrollUp()
    }
    public static explodeWithIndex(form: FormGroup, formName: string,index: string) {
        var basicForm: FormGroup = form.get(formName)?.get(index) as FormGroup;
        Object.keys(basicForm.controls).forEach(field => {
            const control = basicForm.get(field);
            control?.markAsTouched({ onlySelf: true });
        });
        this.scrollUp()
    }
    private static scrollUp() {
        (function smoothscroll() {
            var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
            if (currentScroll > 0) {
                window.scrollTo(0, 0);
            }
        })();
    }
}