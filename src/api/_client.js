// src/pages/_client.js
import axios from "axios";

// 예)
// REACT_APP_API_BASE_URL="https://apiserver.shop/api"
// 또는 프론트 프록시 사용 시 REACT_APP_API_BASE_URL="/api"
const _client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "/api",
  timeout: 15000,
});

_client.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error(
      "[API ERROR]",
      err?.response?.status,
      err?.response?.data || err?.message
    );
    return Promise.reject(err);
  }
);

export default _client;
