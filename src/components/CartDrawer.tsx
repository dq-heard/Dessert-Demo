import { useEffect, useRef, useState } from "react";
import { useStore } from "@nanostores/react";
import { FaTrashCan } from "react-icons/fa6";
import {
  cart,
  cartOpen,
  totalPrice,
  changeQuantity,
  setQuantity,
  removeItem,
  clearCart,
} from "@/lib/cart";

export default function CartDrawer() {
  const items = useStore(cart);
  const open = useStore(cartOpen);
  const total = useStore(totalPrice);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // A native <dialog> gives us focus trapping, Esc to close and an inert page behind it
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Pressing Back from Stripe restores this page from the browser's back/forward cache with
  // its old state, which would leave the buttons stuck on "Working...".
  useEffect(() => {
    const reset = (e: PageTransitionEvent) => {
      if (e.persisted) setBusy(false);
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  async function handleCheckout() {
    setBusy(true);
    setError("");
    try {
      // Only send what the server needs. It looks up the real prices itself.
      const payload = items.map((i) => ({ _id: i._id, quantity: i.quantity }));

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload }),
      });
      if (!res.ok) throw new Error(`Checkout failed (${res.status})`);

      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error("No checkout URL returned");
    } catch (err) {
      console.error(err);
      setError("Sorry, checkout didn't work. Please try again.");
      setBusy(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="cart-drawer"
      aria-labelledby="cart-title"
      onClose={() => cartOpen.set(false)}
      // Only the backdrop sends clicks to the dialog itself, because .cart-panel fills it
      onClick={(e) => {
        if (e.target === e.currentTarget) cartOpen.set(false);
      }}
    >
      <div className="cart-panel">
        <div className="cart-preview-header">
          <h2 id="cart-title" className="h5 mb-0 pt-1">
            Cart: ${total.toFixed(2)}
          </h2>
          <button
            type="button"
            className="btn-close"
            aria-label="Close cart"
            onClick={() => cartOpen.set(false)}
          />
        </div>

        <div className="cart-preview-items">
          {items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul className="list-unstyled mb-0">
              {items.map((item) => (
                <li
                  key={item.lineId}
                  className="d-flex align-items-center py-2"
                >
                  {item.image && (
                    <img
                      src={`${item.image}?w=168&auto=format`}
                      alt=""
                      width={84}
                      height={84}
                      className="flex-shrink-0 object-fit-cover"
                    />
                  )}
                  <div className="flex-grow-1 mx-2 text-start">
                    <p className="h6 mb-0">{item.name}</p>
                    <p className="h6">${item.price.toFixed(2)}</p>
                    {/* Same controls as the product page, just smaller */}
                    <div
                      className="input-group input-group-sm"
                      style={{ maxWidth: "8.5rem" }}
                    >
                      <button
                        type="button"
                        className="btn btn-secondary"
                        aria-label={`Decrease quantity of ${item.name}`}
                        onClick={() => changeQuantity(item.lineId, -1)}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        inputMode="numeric"
                        className="form-control text-center"
                        aria-label={`Quantity of ${item.name}`}
                        value={item.quantity}
                        onChange={(e) =>
                          setQuantity(item.lineId, Number(e.target.value))
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-secondary"
                        aria-label={`Increase quantity of ${item.name}`}
                        onClick={() => changeQuantity(item.lineId, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm ms-auto flex-shrink-0"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => removeItem(item.lineId)}
                  >
                    <FaTrashCan aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-preview-footer">
            {error && (
              <p role="alert" className="text-danger small">
                {error}
              </p>
            )}
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={clearCart}
              disabled={busy}
            >
              Empty Cart
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCheckout}
              disabled={busy}
            >
              {busy ? "Working..." : "Checkout"}
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
