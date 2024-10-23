import { createProxyMiddleware } from "http-proxy-middleware";
import process from "process";

export const handler = async (event, context) => {
  const targetUrl = "https://4hmm5a-ih.myshopify.com/api/2024-10/graphql.json";

  const proxyMiddleware = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: {
      "^/api/2024-10/graphql.json": "/api/2024-10/graphql.json",
    },
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader("Content-Type", "application/json");
      proxyReq.setHeader(
        "X-Shopify-Storefront-Access-Token",
        process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN
      );
    },
    onProxyRes: (_proxyRes, _req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  });

  return new Promise((resolve, reject) => {
    proxyMiddleware(event, context, (err) => {
      if (err) {
        reject({
          statusCode: 500,
          body: JSON.stringify({
            error: "Proxy middleware error",
            details: err.message,
          }),
        });
      } else {
        resolve({
          statusCode: 200,
          body: JSON.stringify({ message: "Proxy middleware executed" }),
        });
      }
    });
  });
};
