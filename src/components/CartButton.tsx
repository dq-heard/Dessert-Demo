import { useStore } from "@nanostores/react";
import { FaBagShopping } from "react-icons/fa6";
import { toggleCart, totalQuantity } from "@/lib/cart";

export default function CartButton() {
  const count = useStore(totalQuantity);

  return (
    <button
      type="button"
      className="btn btn-primary d-inline-flex align-items-center gap-2 px-3"
      onClick={toggleCart}
      aria-haspopup="dialog"
      // The visible word "Cart" is inside this name, so voice control still works
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
    >
      <FaBagShopping aria-hidden="true" />
      <span aria-hidden="true">Cart</span>
      {count > 0 && (
        <span className="badge rounded-pill text-bg-dark" aria-hidden="true">
          {count}
        </span>
      )}
    </button>
  );
}
