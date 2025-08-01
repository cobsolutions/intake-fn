import { FormGroup } from "@angular/forms";

export class CheckInvalidForm{
    public static check(form:FormGroup){
        const invalid = [];
        const controls = form.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        console.log(invalid)
        return invalid;
    }
}