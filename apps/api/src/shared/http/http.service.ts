import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';

@Injectable()
export class HttpService {
  request: AxiosInstance = axios.create({
    timeout: 30000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.61',
    },
  });
  constructor() {
    // Change request data/error here
    this.request.interceptors.request.use(
      async (config) => {
        const _headers: AxiosRequestHeaders | any = {
          'Content-Type': 'application/json',
        };

        config.headers = {
          ..._headers,
          ...config.headers,
        };
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
  get = this.request.get;
  post = this.request.post;
  put = this.request.put;
  delete = this.request.delete;
  patch = this.request.patch;
}
