import axios from 'axios';
import { message } from 'antd';

const request = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 5000,
});

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const msg = error.response?.data?.message || error.message || 'Network Error';
    message.error(msg);
    return Promise.reject(error);
  }
);

export default request;