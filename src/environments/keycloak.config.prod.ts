import { KeycloakConfig } from "keycloak-js";

const keycloakConfigProd: KeycloakConfig = {
    url: 'https://kc.cobsolution.cloud',
    realm: 'COB',
    clientId: 'intake-resource',
  };
  
  export default keycloakConfigProd;