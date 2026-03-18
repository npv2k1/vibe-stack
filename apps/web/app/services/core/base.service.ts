import request from "./http.service";
import { ApiResponse } from "@vibe-stack/shared";

export class BaseService<T = any> {
  http = request;
  basePath = "";
  constructor(basePath?: string) {
    this.basePath = basePath ?? "";
  }

  // reqest() {
  //   return this.http.;
  // }

  // findAll() {
  //   return this.http.get(this.basePath);
  // }
  // find() {
  //   return this.http.get(`${this.basePath}`).then((res) => res.data);
  // }
  // findOne(id) {
  //   return this.http.get(`${this.basePath}${id}`).then((res) => res.data);
  // }
  // create(data: any, options) {
  //   return this.http.post(this.basePath, data, options).then((res) => res.data);
  // }
  // update(id, data) {
  //   return this.http.put(`${this.basePath}${id}`, data).then((res) => res.data);
  // }
  // patch(id, data) {
  //   return this.http
  //     .patch(`${this.basePath}${id}`, data)
  //     .then((res) => res.data);
  // }
  // delete(id) {
  //   return this.http.delete(`${this.basePath}${id}`);
  // }
  // get(url) {
  //   return this.http.get(url).then((res) => res.data);
  // }
  async post<T>(path: any, data: any): Promise<ApiResponse<T>> {
    return await this.http.post(this.basePath + path, data).then((res) => res.data);
  }
  // put(url, data) {
  //   return this.http.put(url, data);
  // }
}
