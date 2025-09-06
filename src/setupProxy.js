// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://apiserver.shop',
      changeOrigin: true,
      secure: true,
      // 필요시 쿠키 전달:
      // cookieDomainRewrite: 'localhost',
      // logLevel: 'debug',
    })
  );
};
