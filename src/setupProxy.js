const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://4.237.58.241:3000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    })
  );
};
