import axios from 'axios';
import { message } from 'antd';

/**
 * Common interceptor setup for all axios instances
 */
const setupInterceptors = (instance) => {
  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      const msg = error.response?.data?.message || error.message || 'Network Error';
      message.error(msg);
      return Promise.reject(error);
    }
  );
  return instance;
};

// Instance for Business Logic API
export const userRequest = setupInterceptors(axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 5000,
}));

// Instance for WireMock Admin API
export const adminRequest = setupInterceptors(axios.create({
  baseURL: 'http://localhost:8088/__admin',
  timeout: 5000,
}));