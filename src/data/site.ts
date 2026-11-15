// Every business-specific detail lives here so the demo can be re-skinned in one place.

export const site = {
  name: "Demo Shop",
  legalName: "Demo Shop",
  // Solid Font Awesome icon (fa6-solid) shown beside the name in the header and footer
  brandIcon: "fa6-solid:cookie-bite",
  description: "A demo storefront built with Astro, Sanity and Stripe.",
  blurb:
    "Demo Shop is a sample storefront for showing off an Astro, Sanity and Stripe build. All products and copy are placeholder content.",
  email: "hello@example.com",
  location: "Anytown, USA",
  address: ["123 Main Street", "Anytown, USA 12345"],
  phone: "(555) 010-0199",
  phoneHref: "+15550100199",
  hours: [
    { days: "Monday - Friday", time: "7:00 AM - 6:00 PM" },
    { days: "Saturday", time: "8:00 AM - 4:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
  // The src from Google Maps > Share > Embed a map. Leave undefined to show a placeholder.
  mapEmbedUrl: undefined as string | undefined,
  // Brand icons only. Facebook and Yelp are solid glyphs; Instagram's is an outline.
  socials: [
    {
      label: "Demo Shop on Facebook",
      href: "https://www.facebook.com/",
      icon: "fa6-brands:facebook-f",
    },
    {
      label: "Demo Shop on Yelp",
      href: "https://www.yelp.com/",
      icon: "fa6-brands:yelp",
    },
  ],
  // Optional: { name: "Your Name", url: "https://example.com" }
  credit: undefined as { name: string; url: string } | undefined,
};
