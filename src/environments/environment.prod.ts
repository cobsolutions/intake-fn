import keycloakConfigProd from "./keycloak.config.prod";

export const environment = {
  production: true,
  baseURL:"/intake-service/api/",
  keycloak: keycloakConfigProd,
  wsurl:"patient-intake-a7d7a58ddf0b.herokuapp.com/intake-service/api/websocket"
};
