import { createProxyMiddleware } from "http-proxy-middleware";
import process from "process";

export const handler = async (event, context) => {
  const targetUrl = "https://4hmm5a-ih.myshopify.com/api/2024-10/graphql.json";

  const req = {
    method: event.httpMethod,
    url: event.path,
    headers: event.headers,
    body: event.body,
  };

  const res = {
    setHeader: (name, value) => context.succeed({ headers: { [name]: value } }),
    writeHead: (statusCode) => context.succeed({ statusCode }),
    end: (data) => context.succeed({ body: data }),
  };

  const proxyMiddleware = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    // pathRewrite: {
    //   "^/api/2024-10/graphql.json": "/api/2024-10/graphql.json",
    // },
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader("Content-Type", "application/json");
      proxyReq.setHeader(
        "X-Shopify-Storefront-Access-Token",
        process.env.STOREFRONT_ACCESS_TOKEN
      );
    },
    onProxyRes: (_proxyRes, _req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  });

  return new Promise((resolve, reject) => {
    proxyMiddleware(req, res, (err) => {
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
