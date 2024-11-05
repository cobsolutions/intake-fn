import { KeycloakEventType, KeycloakOptions, KeycloakService } from 'keycloak-angular';
import { filter, from, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FetshDigitalPatientIntakeUrlsService } from './service/digital.intake.urls/fetsh-digital-patient-intake-urls.service';
import { KcAuthServiceService } from './service/kc/kc-auth-service.service';
export function initializer(keycloak: KeycloakService
  , fetshUrls: FetshDigitalPatientIntakeUrlsService
  , kcAuthServiceService: KcAuthServiceService): () => Promise<boolean> {

  const options: KeycloakOptions = {
    config: environment.keycloak,
    loadUserProfileAtStartUp: false,
    initOptions: {
      onLoad: 'check-sso',
      // onLoad: 'login-required',
      checkLoginIframe: false
    },
    bearerExcludedUrls: []
  };
  from(keycloak.keycloakEvents$)
    .pipe(
      filter(event => event.type === KeycloakEventType.OnTokenExpired))
    .subscribe(() => {
      if (fetshUrls.isDigitalIntakeURLS()) {
        of(keycloak.getToken()).subscribe((newToken: any) => {
          console.log('keycloak.updateToken(20);')
          keycloak.updateToken(1800);
        })
      }
      else
        kcAuthServiceService.logout();
    })
  return () => keycloak.init(options);

}