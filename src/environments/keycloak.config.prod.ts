import { KeycloakConfig } from "keycloak-js";

const keycloakConfigProd: KeycloakConfig = {
    url: 'https://kc-cob-83bdbd045c6f.herokuapp.com',
    realm: 'COB',
    clientId: 'intake-resource',
  };
  
  export default keycloakConfigProd;