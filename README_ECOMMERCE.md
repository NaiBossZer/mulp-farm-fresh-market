# M ULP Farm Fresh Market — E-commerce Flow

The checkout flow is now separated into five screen components and controlled by `src/App.tsx`.

## Flow

`ProductCatalog` → `ProductDetail` → `ShoppingCart` → `ShippingAddress` → `PaymentSlip`

## Main files

- `src/App.tsx` — owns screen routing and shared checkout state.
- `src/components/ProductCatalog.tsx` — Screen 1.
- `src/components/ProductDetail.tsx` — Screen 2.
- `src/components/ShoppingCart.tsx` — Screen 3.
- `src/components/ShippingAddress.tsx` — Screen 4.
- `src/components/PaymentSlip.tsx` — Screen 5.
- `src/components/ecommerce.types.ts` — shared Product / Cart / Shipping types and seed data.
- `src/components/index.ts` — optional barrel exports.

## Interaction changes

- Product search filters the catalog.
- Selecting a product opens Screen 2 with that product.
- Quantity can be adjusted before adding to cart.
- Cart quantities can be increased, decreased or removed.
- Shipping form is validated before moving to payment.
- Delivery method updates the shipping fee.
- Payment slip accepts PNG/JPG/PDF up to 5MB and provides a local preview state.
- Back buttons preserve the shared cart/address state in `App.tsx`.

## Run

```bash
npm install
npm run dev
```
