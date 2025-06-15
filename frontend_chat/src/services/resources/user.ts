import BaseResource from "../base";

class UserResource extends BaseResource {
  updateProfile(payload: any, customHeaders: any = {}): any {
    const payloadFormData = new FormData();
    Object.keys(payload).map((p) => {
      if (Array.isArray(payload[p])) {
        for (var i = 0; i < payload[p].length; i++) {
          payloadFormData.append(`${p}`, payload[p][i]);
        }
      } else {
        payloadFormData.append(p, payload[p]);
      }
    });

    const path = "/update-profile";
    return this.client.request("PUT", path, payloadFormData, {}, customHeaders);
  }

  getUserSideBar(payload: any, customHeaders: any = {}): any {
    const path = "/message/users";
    return this.client.request("GET", path, payload, {}, customHeaders);
  }

  receiveMessages(payload: any, id: string, customHeaders: any = {}): any {
    const path = `/message/${id}`;
    return this.client.request("GET", path, payload, {}, customHeaders);
  }

  sendMessages(payload: any, id: string, customHeaders: any = {}): any {
    const payloadFormData = new FormData();
    Object.keys(payload).map((p) => {
      if (Array.isArray(payload[p])) {
        for (var i = 0; i < payload[p].length; i++) {
          payloadFormData.append(`${p}`, payload[p][i]);
        }
      } else {
        payloadFormData.append(p, payload[p]);
      }
    });
    const path = `/message/send/${id}`;
    return this.client.request(
      "POST",
      path,
      payloadFormData,
      {},
      customHeaders
    );
  }
}

export default UserResource;
