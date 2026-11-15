interface ProductSlug {
  current: string;
}

interface BaseProduct {
  _id: string;
  name: string;
  price: number;
}

// Shape returned by getProducts() (the grid)
export interface Product extends BaseProduct {
  slug: ProductSlug;
  image?: string;
  new?: boolean | null;
  best_seller?: boolean | null;
}

// Shape returned by getProduct(slug) (the detail page)
export interface ProductDetail extends Product {
  details: string;
}

export interface CartItem {
  lineId: string; // unique cart line, so the same gift card can appear at different amounts
  _id: string;
  _type: "product";
  name: string;
  price: number; // display only
  quantity: number;
  image?: string;
  meta?: {
    recipientEmail?: string;
    recipientName?: string;
    message?: string;
    sendOn?: string;
  };
}
