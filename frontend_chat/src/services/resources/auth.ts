import BaseResource from "../base";

class AuthResource extends BaseResource {
  getProfileApi(payload: any, customHeaders: any = {}): any {
    const path = `/me`;
    return this.client.request("GET", path, payload, {}, customHeaders);
  }
  signin(payload: any, customHeaders: any = {}): any {
    const path = `/auth/signin`;
    return this.client.request("POST", path, payload, {}, customHeaders);
  }
  signup(payload: any, customHeaders: any = {}): any {
    const path = `/auth/signup`;
    return this.client.request("POST", path, payload, {}, customHeaders);
  }
}

export default AuthResource;
