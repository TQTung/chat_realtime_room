import type { Config } from "./requestApi";
import ClientApi from "./requestApi";
import AuthResource from "./resources/auth";
import UserResource from "./resources/user";

export default class AppServices {
  public client: ClientApi;
  public auth: AuthResource;
  public user: UserResource;

  constructor(config: Config) {
    this.client = new ClientApi(config);

    this.auth = new AuthResource(this.client);
    this.user = new UserResource(this.client);
  }
}
