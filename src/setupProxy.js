// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://ocean21.in',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/api', // This is optional, based on your API structure
            },
        })
    );
};
