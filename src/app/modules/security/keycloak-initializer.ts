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
  return () => keycloak.init(options);

}