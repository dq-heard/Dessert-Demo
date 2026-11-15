// Replaces CartContext. Astro islands don't share a React tree, so a React
// context can't connect separate islands; a nanostores atom can.
// Requires: npm i nanostores
import { atom, computed } from "nanostores";
import type { CartItem } from "./types";

const STORAGE_KEY = "cart";

export const cart = atom<CartItem[]>([]);
export const cartOpen = atom(false);

// Display only. The checkout endpoint must look up real prices on the server.
export const totalQuantity = computed(cart, (items) =>
  items.reduce((sum, i) => sum + i.quantity, 0)
);
export const totalPrice = computed(cart, (items) =>
  items.reduce((sum, i) => sum + i.price * i.quantity, 0)
);

if (typeof window !== "undefined") {
  try {
    cart.set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));
  } catch {
    // corrupted storage: start with an empty cart
  }
  cart.listen((items) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full or blocked: the cart still works for this visit
    }
  });
}

/** addItem: merges into an existing line with the same lineId. */
export function addItem(item: CartItem) {
  const items = cart.get();
  const exists = items.some((i) => i.lineId === item.lineId);

  cart.set(
    exists
      ? items.map((i) =>
          i.lineId === item.lineId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      : [...items, item]
  );
}

/** Was toggleCartItemQty(id, "increase" | "decrease"). Pass +1 or -1. */
export function changeQuantity(lineId: string, delta: number) {
  cart.set(
    cart
      .get()
      .map((i) =>
        i.lineId === lineId
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i
      )
  );
}

/** Sets an exact quantity (1-20), for the number input in the drawer. */
export function setQuantity(lineId: string, quantity: number) {
  const clamped = Math.min(20, Math.max(1, Math.floor(quantity) || 1));
  cart.set(
    cart
      .get()
      .map((i) => (i.lineId === lineId ? { ...i, quantity: clamped } : i))
  );
}

/** Was onRemove. */
export function removeItem(lineId: string) {
  cart.set(cart.get().filter((i) => i.lineId !== lineId));
}

/** Was emptyCart. */
export function clearCart() {
  cart.set([]);
}

/** Was setShowCart. */
export function toggleCart() {
  cartOpen.set(!cartOpen.get());
}
