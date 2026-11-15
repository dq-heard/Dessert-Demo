import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "sanity:client";

const builder = createImageUrlBuilder(sanityClient);

export const urlFor = (source: { _ref: string }) => builder.image(source);
