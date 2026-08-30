export type ProductCategory = "Leafy Greens" | "Herbs" | "Hydroponics";

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: ProductCategory;
  image: string;
  harvestDate: string;
  plot: string;
  stock: "In Stock" | "Low Stock";
  description: string;
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
  deliveryMethod: "standard" | "express";
  saveAddress: boolean;
  billingSameAsShipping: boolean;
}

export const DEFAULT_SHIPPING_INFO: ShippingInfo = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  subdistrict: "",
  district: "",
  province: "",
  postalCode: "",
  deliveryMethod: "standard",
  saveAddress: true,
  billingSameAsShipping: true,
};

export const PRODUCTS: Product[] = [
  {
    id: "green-oak",
    name: "Green Oak Lettuce",
    price: 3.2,
    unit: "250g pack",
    category: "Leafy Greens",
    image: "https://images.unsplash.com/photo-1691906470255-640353380f3d?auto=format&fit=crop&w=900&q=85",
    harvestDate: "May 12",
    plot: "Plot A3 - Optimal",
    stock: "In Stock",
    description: "Crisp, sweet green oak lettuce grown under monitored greenhouse conditions for consistent freshness and texture.",
    features: ["GAP Certified", "IoT monitored", "Harvested to order", "Cold-chain ready"],
  },
  {
    id: "butterhead",
    name: "Hydroponic Butterhead",
    price: 4.1,
    unit: "300g pack",
    category: "Hydroponics",
    image: "https://images.unsplash.com/photo-1640958904159-51ae08bd3412?auto=format&fit=crop&w=900&q=85",
    harvestDate: "May 13",
    plot: "Plot C2 - Optimal",
    stock: "In Stock",
    description: "Tender hydroponic butterhead with a clean finish and delicate leaves, ideal for salads and fresh wraps.",
    features: ["Hydroponic", "GAP Certified", "IoT monitored", "Same-week harvest"],
  },
  {
    id: "curly-kale",
    name: "Curly Kale",
    price: 2.9,
    unit: "200g pack",
    category: "Leafy Greens",
    image: "https://images.unsplash.com/photo-1586288415925-d7affaf2d1f0?auto=format&fit=crop&w=900&q=85",
    harvestDate: "May 11",
    plot: "Plot D4 - Optimal",
    stock: "In Stock",
    description: "Deep green curly kale with a firm bite, freshly harvested from a precision-monitored plot.",
    features: ["GAP Certified", "IoT monitored", "Rich in fiber", "Fresh harvest"],
  },
  {
    id: "arugula",
    name: "Wild Arugula",
    price: 3.4,
    unit: "150g pack",
    category: "Herbs",
    image: "https://images.unsplash.com/photo-1514910103003-aa6b5e4239ad?auto=format&fit=crop&w=900&q=85",
    harvestDate: "May 09",
    plot: "Plot A1 - Optimal",
    stock: "Low Stock",
    description: "Peppery wild arugula that adds character to salads, sandwiches and chef-style plating.",
    features: ["GAP Certified", "IoT monitored", "Low-stock alert", "Small-batch harvest"],
  },
  {
    id: "baby-spinach",
    name: "Baby Spinach",
    price: 3.8,
    unit: "250g pack",
    category: "Leafy Greens",
    image: "https://images.unsplash.com/photo-1598278242809-6c21ee17aef1?auto=format&fit=crop&w=900&q=85",
    harvestDate: "May 13",
    plot: "Plot C5 - Optimal",
    stock: "In Stock",
    description: "Soft baby spinach leaves with a fresh, mild flavour, packed shortly after harvest.",
    features: ["GAP Certified", "IoT monitored", "Ready to eat", "Cold-chain ready"],
  },
  {
    id: "thai-basil",
    name: "Thai Basil",
    price: 2.6,
    unit: "100g pack",
    category: "Herbs",
    image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?auto=format&fit=crop&w=900&q=85",
    harvestDate: "May 12",
    plot: "Plot B2 - Stable",
    stock: "In Stock",
    description: "Fragrant Thai basil cultivated in a controlled environment for vibrant leaves and strong aroma.",
    features: ["GAP Certified", "IoT monitored", "Aromatic herb", "Fresh harvest"],
  },
];
