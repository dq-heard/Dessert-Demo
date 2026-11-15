import { useState } from "react";
import { addItem, cartOpen } from "@/lib/cart";

interface Props {
  product: { _id: string; name: string; price: number; image?: string };
}

export default function AddToCart({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("");

  function handleAdd() {
    addItem({
      lineId: product._id,
      _id: product._id,
      _type: "product",
      name: product.name,
      price: product.price, // display only; the server uses the Sanity price
      quantity,
      image: product.image,
    });
    setStatus(`Added ${quantity} × ${product.name} to your cart.`);
  }

  return (
    <div>
      <label htmlFor="product-quantity" className="form-label">
        Quantity
      </label>
      <div className="d-flex flex-wrap align-items-center gap-3">
        <div className="input-group" style={{ maxWidth: "10.5rem" }}>
          <button
            type="button"
            className="btn btn-secondary"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            -
          </button>
          <input
            id="product-quantity"
            type="number"
            min={1}
            max={20}
            inputMode="numeric"
            className="form-control text-center"
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.min(20, Math.max(1, Number(e.target.value) || 1))
              )
            }
          />
          <button
            type="button"
            className="btn btn-secondary"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
          >
            +
          </button>
        </div>

        <button
          type="button"
          className="btn btn-primary border-inner py-3 px-5"
          onClick={handleAdd}
        >
          Add to Cart
        </button>
      </div>

      <p role="status" className="mt-3 mb-0">
        {status}
        {status && (
          <>
            {" "}
            <button
              type="button"
              className="btn btn-link p-0 align-baseline"
              onClick={() => cartOpen.set(true)}
            >
              View cart
            </button>
          </>
        )}
      </p>
    </div>
  );
}
