// Requires an SSR adapter (npx astro add vercel | netlify | cloudflare | node).
// Requires: npm i stripe
import type { APIRoute } from "astro";
import Stripe from "stripe";
import { sanityClient } from "sanity:client";
import { getSecret } from "astro:env/server";

export const prerender = false;

interface IncomingItem {
  _id: string;
  quantity: number;
}

interface Doc {
  _id: string;
  name?: string;
  price?: number;
  image?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  try {
    // astro:env reads the secret at request time, which is what Cloudflare Workers need
    const secretKey = await getSecret("STRIPE_SECRET_KEY");
    if (!secretKey) return json({ error: "Stripe isn't configured" }, 500);
    // Workers have no Node HTTP stack, so Stripe has to use fetch
    const stripe = new Stripe(secretKey, {
      httpClient: Stripe.createFetchHttpClient(),
    });

    const body = await request.json().catch(() => null);
    const items: IncomingItem[] = Array.isArray(body?.items)
      ? body.items.slice(0, 50)
      : [];
    if (items.length === 0) return json({ error: "Your cart is empty" }, 400);

    // The browser only tells us WHAT is in the cart. Prices come from Sanity.
    const ids = [
      ...new Set(
        items.map((i) => i._id).filter((id) => typeof id === "string")
      ),
    ];
    const docs = await sanityClient.fetch<Doc[]>(
      `*[_type == "product" && _id in $ids]{
        _id, name, price,
        "image": images[0].asset->url
      }`,
      { ids }
    );
    const byId = new Map(docs.map((d) => [d._id, d]));

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of items) {
      const doc = byId.get(item._id);
      const quantity = Math.floor(Number(item.quantity));

      if (!doc || !(quantity >= 1 && quantity <= 20)) {
        return json({ error: "Invalid cart item" }, 400);
      }

      const unitPrice = Number(doc.price);
      if (!(unitPrice > 0))
        return json({ error: "Invalid product price" }, 400);

      line_items.push({
        quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(unitPrice * 100), // Stripe wants whole cents
          product_data: {
            name: doc.name ?? "Product",
            // Stripe fetches this image itself, so ask Sanity for a plain JPEG
            images: doc.image ? [`${doc.image}?w=800&fm=jpg`] : undefined,
          },
        },
      });
    }

    const origin = new URL(request.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    });

    return json({ url: session.url });
  } catch (error) {
    console.error("Checkout error", error);
    return json({ error: "Internal Server Error" }, 500);
  }
};
