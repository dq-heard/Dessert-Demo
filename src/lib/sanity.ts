import { sanityClient } from "sanity:client";
import type { Product, ProductDetail } from "./types";

// Grid: no arguments, returns an array
export async function getProducts(): Promise<Product[]> {
  return sanityClient.fetch<Product[]>(
    `*[_type=="product"] | order(best_seller desc, name asc){
      _id, name, slug, price,
      "image": images[0].asset->url,
      new, best_seller
    }`
  );
}

// Detail page: takes a slug, returns one product or null
export async function getProduct(slug: string): Promise<ProductDetail | null> {
  return sanityClient.fetch<ProductDetail | null>(
    `*[_type=="product" && slug.current==$slug][0]{
      _id, name, slug, price,
      "details": description,
      "image": images[0].asset->url,
      new, best_seller
    }`,
    { slug }
  );
}
