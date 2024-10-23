import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import process from "process";

const storefrontAccessToken = process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          "https://idyllic-concha-a54637.netlify.app/api/2024-10/graphql.json",
          {
            headers: {
              "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
            },
            params: {
              query: `
              {
                    products(first: 10) {
                      edges {
                        node {
                          id
                          title
                          priceRange {
                            minVariantPrice {
                              amount
                            }
                          }
                          featuredImage {
                            url
                            altText
                          }
                          variants(first: 10) {
                            edges {
                              node {
                                id
                                title
                                priceV2 {
                                  amount
                                  currencyCode
                                }
                                availableForSale
                              }
                            }
                          }
                        }
                      }
                    }
                  }

              `,
            },
          }
        );
        // console.log(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products.");
      }
    },

    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,

    onError: (error) => {
      console.log("Error fetching products: ", error);
    },
  });
};
