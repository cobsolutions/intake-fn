import { KeycloakConfig } from "keycloak-js";

const keycloakConfig: KeycloakConfig = {
    url: 'http://localhost:8082',
    realm: 'COB',
    clientId: 'intake-resource',
  };
  
  export default keycloakConfig;