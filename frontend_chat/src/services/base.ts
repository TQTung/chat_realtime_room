import type ClientApi from "./requestApi";

export default class BaseResource {
  public client: ClientApi;

  constructor(client: ClientApi) {
    this.client = client;
  }
}
